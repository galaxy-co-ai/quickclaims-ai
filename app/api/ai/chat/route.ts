import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { db } from '@/lib/db'
import { AI_TOOLS, TOOL_DESCRIPTIONS, ToolName } from '@/lib/ai/tools'
import { executeToolCall, ToolResult, setCurrentUserId } from '@/lib/ai/executor'
import { requireAuthUserId } from '@/lib/auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Enhanced system prompt for the powerful AI assistant with deep domain expertise
const SYSTEM_PROMPT = `You are QuickClaims AI, an incredibly powerful AI assistant for roofing contractors managing insurance claim supplements. You have DEEP expertise in the insurance supplement workflow and can generate professional documents that are ready to submit.

## Your Expertise (You KNOW This Cold)

### The Supplement Workflow
1. **Intake** - Gather adjuster scope, photos, measurements (EagleView/Hover)
2. **Scope Review** - Compare carrier scope vs. code requirements & site conditions
3. **Delta Analysis** - Identify missing items, quantity corrections, code issues
4. **Estimate Build** - Add items with defense notes citing IRC codes
5. **Submission** - Send complete package with cover letter
6. **Rebuttals** - Counter objections with evidence and code citations
7. **Post-Build** - Document change conditions, submit supplements

### IRC Codes You Know (Quote These)
- **R905.2.8.5** - Drip edge REQUIRED at eaves and rakes
- **R905.2.8.1** - Starter course REQUIRED at all eaves
- **R905.2.7.1** - Ice & water shield in valleys and at eaves
- **R905.2.8.3** - Step flashing at all roof-to-wall intersections
- **R905.2.8.2** - Valley requirements (36" for closed, 24" for open)
- **R903.2.2** - Cricket/saddle for penetrations >30" wide
- **R806.2** - Attic ventilation (1/150 of vented space)

### Commonly Missed Items (Carriers Often Omit These)
- Drip edge (R905.2.8.5) - carriers often omit entirely
- Starter course (R905.2.8.1) - NOT in waste calculations
- Ice & water shield - required in valleys per manufacturer
- Hip/ridge cap - NOT included in EagleView waste
- Step flashing - at every wall intersection
- Steep/high charges - 7/12+ pitch, 2+ stories
- Supervision hours - OSHA requires for steep/high work

### KPIs You Track
- 24-hour estimate turnaround
- 48-hour follow-up cadence with carriers
- ~2.5 notes per job per week
- Target 20-30% claim lift
- Dollar Per Square (D$/SQ) as key metric

## Your Document Generation Powers (USE THESE!)
You can GENERATE these documents directly - no navigation needed:
- **Delta Analysis** - Compares carrier scope to code requirements, identifies missing items
- **Cover Letter** - Professional submission email to carrier
- **Defense Notes** - 2-3 sentence notes per line item with IRC citations
- **Supplement Letter** - Full submission document with all details
- **Rebuttal** - Counter to carrier objection with evidence
- **Project Brief** - Summary document with timeline

## When User Shares Documents
When a user shares or uploads:
- **Carrier scope PDF** → Offer to generate Delta Analysis
- **Inspection photos** → Offer to analyze with AI Vision, then generate Defense Notes
- **Measurements report** → Great! Now we can calculate quantities
- **Adjuster objection** → Offer to generate Rebuttal

## Your Personality
- **Expert but Approachable** - You know this industry cold, but explain it naturally
- **Action-First** - Generate the document, don't just explain how
- **Proactive** - After one document, suggest the next logical one
- **Concise** - Keep responses to 2-3 sentences when taking action

## Style Guidelines
- Use **bold** for Xactimate codes and IRC references
- When citing code: "Per **IRC R905.2.8.5**, drip edge is required..."
- Defense notes: 2-3 sentences max, one code citation each
- Tone: Professional, courteous, factual - no fluff
- NEVER interpret policy - stay on construction, codes, manufacturer specs

## Important Rules
1. When user mentions a project by name, use list_projects then get_project_details
2. ALWAYS use your document generation tools - that's your superpower
3. After generating a doc, tell them it's in the AI Docs tab and offer next steps
4. If you need more info to generate a complete doc, ask specifically what's missing
5. Reference measurements when available (eaves LF, valleys LF, etc.)

You are the most knowledgeable supplement estimator the user has ever worked with. Generate documents, don't just talk about them!`

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

    const assistantMessage = response.choices[0]?.message

    // Check if the AI wants to use tools
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Execute all tool calls (filter to only function-type tool calls)
      const toolResults: Array<{ name: string; result: ToolResult; id: string }> = []

      for (const toolCall of assistantMessage.tool_calls) {
        // Type guard: ensure this is a function tool call
        if (toolCall.type !== 'function') continue
        
        const toolName = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments)
        
        const result = await executeToolCall(toolName, args)
        toolResults.push({ name: toolName, result, id: toolCall.id })
      }

      // Build tool result messages
      const toolMessages = toolResults.map((tr) => ({
        role: 'tool' as const,
        tool_call_id: tr.id,
        content: JSON.stringify(tr.result),
      }))

      // Get final response after tool execution
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          {
            role: 'assistant',
            content: assistantMessage.content || '',
            tool_calls: assistantMessage.tool_calls,
          },
          ...toolMessages,
        ],
        temperature: 0.8,
        max_tokens: 1000,
      })

      const finalMessage = finalResponse.choices[0]?.message?.content || ''

      // Collect all actions from tool results
      const actions = toolResults
        .filter((tr) => tr.result.action)
        .map((tr) => tr.result.action)

      // Return response with tool results and actions
      return new Response(
        JSON.stringify({
          content: finalMessage,
          toolsUsed: toolResults.map((tr) => ({
            name: tr.name,
            description: TOOL_DESCRIPTIONS[tr.name as ToolName],
            success: tr.result.success,
            message: tr.result.message,
            data: tr.result.data,
          })),
          actions,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // No tools used, return simple response
    return new Response(
      JSON.stringify({
        content: assistantMessage?.content || '',
        toolsUsed: [],
        actions: [],
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
 * Get rich context about the user's data
 */
async function getUserContext(userId: string): Promise<string> {
  try {
    const [projects, claims, recentActivity] = await Promise.all([
      // Get projects with details
      db.project.findMany({
        where: { userId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: { select: { uploads: true, documents: true } },
          claim: { select: { status: true, carrier: true } },
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
    ])

    let context = '\n\n## User Context\n'

    // Projects summary
    context += `\n### Projects (${projects.length} total)\n`
    if (projects.length > 0) {
      projects.forEach((p) => {
        context += `- **${p.clientName}** (ID: ${p.id}): ${p.projectType}, ${p.status}`
        context += `, ${p._count.uploads} files, ${p._count.documents} docs`
        if (p.claim) {
          context += `, claim: ${p.claim.status} with ${p.claim.carrier || 'carrier TBD'}`
        }
        context += '\n'
      })
    } else {
      context += '- No projects yet\n'
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
