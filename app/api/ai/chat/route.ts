import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { db } from '@/lib/db'
import { AI_TOOLS, TOOL_DESCRIPTIONS, ToolName } from '@/lib/ai/tools'
import { executeToolCall, ToolResult, setCurrentUserId } from '@/lib/ai/executor'
import { requireAuthUserId } from '@/lib/auth'

// Force Node.js runtime for PDF parsing support
export const runtime = 'nodejs'

// Extend timeout for complex operations (PDF parsing + document generation)
// Vercel Pro allows up to 300s, Hobby allows 60s
export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// System prompt: Warm, concise, action-first AI assistant
const SYSTEM_PROMPT = `You're a supplement estimator who's been doing this for 10 years. You know Xactimate codes cold, you know what carriers miss, and you know IRC code citations by heart. You're helping a busy contractor who doesn't have time for fluff.

## Your Expertise

### IRC Codes (Quote These)
- **R905.2.8.5** - Drip edge REQUIRED at eaves and rakes
- **R905.2.8.1** - Starter course REQUIRED at all eaves
- **R905.2.7.1** - Ice & water shield in valleys and at eaves
- **R905.2.8.3** - Step flashing at all roof-to-wall intersections
- **R905.2.8.2** - Valley requirements (36" for closed, 24" for open)
- **R903.2.2** - Cricket/saddle for penetrations >30" wide
- **R806.2** - Attic ventilation (1/150 of vented space)

### Commonly Missed Items
- Drip edge (R905.2.8.5) - carriers often omit entirely
- Starter course (R905.2.8.1) - NOT in waste calculations
- Ice & water shield - required in valleys per manufacturer
- Hip/ridge cap - NOT included in EagleView waste
- Step flashing - at every wall intersection
- Steep/high charges - 7/12+ pitch, 2+ stories

### Document Types You Generate
- **Delta Analysis** - Compares scope to code requirements, finds missing items
- **Cover Letter** - Submission email to carrier
- **Defense Notes** - 2-3 sentence notes with IRC citations (ready for Xactimate)
- **Supplement Letter** - Complete submission document
- **Rebuttal** - Counter to carrier objection
- **Project Brief** - Summary with timeline

## Your Personality

**Be direct. Be warm. Do the work first, explain briefly after.**

- Match their energy - casual if they're casual, tighter if formal
- No filler: Never say "I'd be happy to help" or "Great question!" Just help. Just answer.
- Action-first: When they drop a scope PDF, parse it → create project → generate docs. Don't ask permission.
- Concise: "Created. Johnson project at 123 Oak St — found 6 missing items, defense notes ready."
- Proactive: After creating something, suggest the one logical next step. Not a menu.

## Response Formatting

1. **Inline links**: Always use [Project Name](/projects/id) or [View Project](/projects/id) format - never say "go to the project page"
2. **Concise confirmations**: "Done." "Created." "Generated." Not paragraphs.
3. **Bullet summaries** for multi-item results
4. **One follow-up**: Suggest the next logical action, not a list of options
5. **No redundant tool badges**: Let your actions speak for themselves

## File Handling

When user uploads a file:
- **Carrier scope PDF** → Parse it automatically (extract address, carrier, claim #, line items, totals, D$/SQ). Create project if none exists. Generate delta analysis and defense notes automatically.
- **Photos** → Analyze with AI Vision automatically. Tag and categorize. No asking.
- **Other documents** → Figure out what it is and handle it.

## Workflow Rules

1. **When they drop a scope PDF**: Parse → Create project → Create claim → Generate delta analysis → Generate defense notes. Chain it all automatically.
2. **When creating projects**: Extract FULL address (street, city, state, ZIP) from documents. If missing, ask specifically for it.
3. **After generating docs**: Include direct link to project. "Delta analysis ready. [View Johnson Project](/projects/xyz)"
4. **If you need info**: Ask specifically what's missing. "Need the property address to create the project."
5. **When they mention a project**: Use list_projects then get_project_details to find it.
6. **Stay construction-focused**: IRC codes, manufacturer specs, measurements. NO policy interpretation.

## Example Responses

Good:
"Got it. Created Johnson project at 123 Oak St, Tulsa OK. Parsed 42 line items ($18,240 RCV, $14.80 D/SQ), found 7 missing items. Delta analysis and defense notes ready.

[View Johnson Project](/projects/xyz) · [AI Docs](/projects/xyz?tab=documents)"

Bad:
"I'd be happy to help you with that! I've created a new project for you. Would you like me to generate some documents for it?"

You're the most capable supplement estimator they've ever worked with. Act like it.`

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  tool_calls?: Array<{
    id: string
    function: { name: string; arguments: string }
  }>
  tool_call_id?: string
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await requireAuthUserId()
    
    // Check rate limit
    const { checkRateLimit, aiChatLimiter } = await import('@/lib/rate-limit')
    const rateLimitResponse = await checkRateLimit(aiChatLimiter, userId)
    if (rateLimitResponse) return rateLimitResponse
    
    // Set user ID for executor tool calls
    setCurrentUserId(userId)

    const body = await request.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Get rich user context
    const userContext = await getUserContext(userId)

    // Build the full system prompt with context
    const fullSystemPrompt = SYSTEM_PROMPT + userContext

    // Create initial response with tools
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: fullSystemPrompt },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ],
      tools: AI_TOOLS,
      tool_choice: 'auto',
      temperature: 0.8, // Slightly higher for more natural conversation
      max_tokens: 1500,
    })

    let assistantMessage = response.choices[0]?.message

    // Multi-step tool execution loop (up to 5 iterations for complex workflows)
    // This allows the AI to chain multiple tool calls automatically
    const allToolResults: Array<{ name: string; result: ToolResult; id: string }> = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversationMessages: Array<any> = [
      { role: 'system' as const, content: fullSystemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ]
    
    let currentMessage = assistantMessage
    let iteration = 0
    const maxIterations = 5

    // Loop: Execute tools, get response, check if more tools needed
    // If no tool calls initially, skip loop and return simple response
    if (!currentMessage?.tool_calls || currentMessage.tool_calls.length === 0) {
      return new Response(
        JSON.stringify({
          content: currentMessage?.content || '',
          toolsUsed: [],
          actions: [],
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    while (currentMessage?.tool_calls && currentMessage.tool_calls.length > 0 && iteration < maxIterations) {
      iteration++
      
      // Execute all tool calls in this iteration
      const toolResults: Array<{ name: string; result: ToolResult; id: string }> = []

      for (const toolCall of currentMessage.tool_calls) {
        // Type guard: ensure this is a function tool call
        if (toolCall.type !== 'function') continue
        
        const toolName = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments)
        
        const result = await executeToolCall(toolName, args)
        toolResults.push({ name: toolName, result, id: toolCall.id })
        allToolResults.push({ name: toolName, result, id: toolCall.id })
      }

      // Build tool result messages
      const toolMessages = toolResults.map((tr) => ({
        role: 'tool' as const,
        tool_call_id: tr.id,
        content: JSON.stringify(tr.result),
      }))

      // Add assistant message and tool results to conversation
      conversationMessages.push({
        role: 'assistant' as const,
        content: currentMessage.content || '',
        tool_calls: currentMessage.tool_calls,
      })
      conversationMessages.push(...toolMessages)

      // Get next response - AI may want to call more tools or provide final answer
      const nextResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversationMessages,
        tools: AI_TOOLS,
        tool_choice: 'auto',
        temperature: 0.8,
        max_tokens: iteration === maxIterations ? 1000 : 1500, // Shorter on last iteration
      })

      currentMessage = nextResponse.choices[0]?.message
    }

    // Get final message content
    const finalMessage = currentMessage?.content || ''

    // Collect all actions from tool results (use the last action if multiple)
    const actions = allToolResults
      .filter((tr) => tr.result.action)
      .map((tr) => tr.result.action)
    // Use the last action for navigation (most recent)
    const finalAction = actions.length > 0 ? actions[actions.length - 1] : undefined

    // Return response with all tool results and final action
    return new Response(
      JSON.stringify({
        content: finalMessage,
        toolsUsed: allToolResults.map((tr) => ({
          name: tr.name,
          description: TOOL_DESCRIPTIONS[tr.name as ToolName],
          success: tr.result.success,
          message: tr.result.message,
          data: tr.result.data,
        })),
        actions: finalAction ? [finalAction] : [],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to process chat', details: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * Get rich context about the user's data with proactive hints
 */
async function getUserContext(userId: string): Promise<string> {
  try {
    const [projects, claims, recentActivity, recentUploads] = await Promise.all([
      // Get projects with detailed state
      db.project.findMany({
        where: { userId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: { select: { uploads: true, documents: true } },
          claim: {
            select: {
              id: true,
              status: true,
              carrier: true,
              carrierScopes: {
                take: 1,
                orderBy: { version: 'desc' },
                select: { id: true },
              },
              deltas: {
                where: { status: 'identified' },
                select: { id: true },
              },
            },
          },
          uploads: {
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              fileType: true,
              fileName: true,
              createdAt: true,
            },
          },
          documents: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { type: true },
          },
        },
      }),
      // Get claim stats
      db.claim.findMany({
        where: { project: { userId } },
        select: {
          status: true,
          carrier: true,
          project: { select: { clientName: true } },
        },
      }),
      // Get recent activity
      db.claimActivity.findMany({
        where: { claim: { project: { userId } } },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { action: true, description: true, createdAt: true },
      }),
      // Get recent uploads across all projects
      db.upload.findMany({
        where: { project: { userId } },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          fileName: true,
          fileType: true,
          createdAt: true,
          project: { select: { clientName: true } },
        },
      }),
    ])

    let context = '\n\n## User Context\n'

    // Projects with state hints
    context += `\n### Recent Projects (${projects.length})\n`
    if (projects.length > 0) {
      projects.forEach((p) => {
        const hasScope = p.claim?.carrierScopes && p.claim.carrierScopes.length > 0
        const hasDeltas = p.claim?.deltas && p.claim.deltas.length > 0
        const hasDefenseNotes = p.documents.some(d => d.type === 'defense_notes')
        const hasDeltaAnalysis = p.documents.some(d => d.type === 'delta_analysis')
        const photoCount = p.uploads.filter(u => u.fileType === 'photo').length
        const scopeCount = p.uploads.filter(u => u.fileType === 'scope').length

        context += `- **${p.clientName}** (ID: ${p.id}): ${p.projectType}, ${p.status}`
        context += `, ${p._count.uploads} files, ${p._count.documents} docs`
        if (p.claim) {
          context += `, claim: ${p.claim.status} with ${p.claim.carrier || 'carrier TBD'}`
        }
        
        // State hints for proactive suggestions
        const hints: string[] = []
        if (hasScope && !hasDeltaAnalysis) {
          hints.push('has scope but no delta analysis')
        }
        if (hasScope && !hasDefenseNotes) {
          hints.push('has scope but no defense notes')
        }
        if (photoCount > 0 && !hasDefenseNotes) {
          hints.push('has photos but no defense notes')
        }
        if (scopeCount === 0 && photoCount > 0) {
          hints.push('has photos but no scope uploaded')
        }
        if (hasDeltas && !hasDefenseNotes) {
          hints.push('has identified deltas but no defense notes')
        }
        
        if (hints.length > 0) {
          context += ` [${hints.join(', ')}]`
        }
        context += '\n'
      })
    } else {
      context += '- No projects yet\n'
    }

    // Recent uploads
    if (recentUploads.length > 0) {
      context += `\n### Recent Uploads\n`
      recentUploads.forEach((u) => {
        const timeAgo = getTimeAgo(u.createdAt)
        context += `- ${u.fileName} (${u.fileType}) to ${u.project.clientName} ${timeAgo}\n`
      })
    }

    // Claims summary
    if (claims.length > 0) {
      context += `\n### Active Claims (${claims.length})\n`
      const byStatus = claims.reduce(
        (acc, c) => {
          acc[c.status] = (acc[c.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
      Object.entries(byStatus).forEach(([status, count]) => {
        context += `- ${status}: ${count}\n`
      })
    }

    // Recent activity
    if (recentActivity.length > 0) {
      context += `\n### Recent Activity\n`
      recentActivity.forEach((a) => {
        context += `- ${a.action.replace(/_/g, ' ')}: ${a.description || ''}\n`
      })
    }

    return context
  } catch {
    return '\n\n## User Context\nUnable to load user data.\n'
  }
}

/**
 * Helper: Get human-readable time ago
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
