/**
 * AI Document Generator
 * 
 * Generates professional documents for insurance supplement workflow.
 * Uses Claude for high-quality text generation with domain knowledge.
 */

import Anthropic from '@anthropic-ai/sdk'
import { db } from '@/lib/db'
import { 
  COMMONLY_MISSED_ITEMS,
  XACTIMATE_CODES,
  IRC_ROOFING_CODES,
  DOCUMENT_TEMPLATES,
  WORKFLOW_PHASES,
  getKnowledgeSummary,
  type DocumentType
} from './knowledge'

// Lazy initialization to check API key at runtime
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not configured. Please add it in Vercel Settings > Environment Variables.')
  }
  return new Anthropic({ apiKey })
}

// Types for document generation
export interface ProjectContext {
  projectId: string
  clientName: string
  address: string
  projectType: string
  roofSquares?: number
  pitch?: string
  stories?: number
  carrierName?: string
  claimNumber?: string
  dateOfLoss?: Date
  adjusterName?: string
  carrierScope?: {
    totalRCV: number
    lineItems: Array<{
      code?: string
      description: string
      quantity: number
      unit: string
      rcv: number
    }>
  }
  photos?: Array<{
    id: string
    url: string
    category?: string
    tags?: string[]
    description?: string
  }>
  measurements?: {
    totalSquares?: number
    eaves?: number
    rakes?: number
    valleys?: number
    ridges?: number
    hips?: number
    stepFlashing?: number
  }
}

export interface GeneratedDocument {
  type: DocumentType
  title: string
  content: string
  contentJson: Record<string, unknown>
  projectId: string
  generatedBy: string
}

/**
 * Generate a delta analysis report
 */
export async function generateDeltaAnalysis(context: ProjectContext): Promise<GeneratedDocument> {
  const missedItems = identifyMissedItems(context)
  
  const prompt = `You are an expert roofing supplement estimator. Generate a professional Delta Analysis Report.

${getKnowledgeSummary()}

## Project Context
- **Client:** ${context.clientName}
- **Address:** ${context.address}
- **Carrier:** ${context.carrierName || 'TBD'}
- **Claim #:** ${context.claimNumber || 'TBD'}
- **Roof Squares:** ${context.roofSquares || 'Unknown'}
- **Pitch:** ${context.pitch || 'Unknown'}
- **Stories:** ${context.stories || 'Unknown'}

## Carrier Scope Summary
${context.carrierScope ? `
Total RCV: $${context.carrierScope.totalRCV.toLocaleString()}
Line Items: ${context.carrierScope.lineItems.length}
` : 'Carrier scope not yet uploaded'}

## Measurements Available
${context.measurements ? `
- Eaves: ${context.measurements.eaves || 0} LF
- Rakes: ${context.measurements.rakes || 0} LF
- Valleys: ${context.measurements.valleys || 0} LF
- Ridge: ${context.measurements.ridges || 0} LF
- Hips: ${context.measurements.hips || 0} LF
- Step Flashing Areas: ${context.measurements.stepFlashing || 0} LF
` : 'Measurements pending'}

## Likely Missing Items Based on Analysis
${missedItems.map(item => `
- **${item.name}** (${item.code})
  - IRC: ${item.ircCode || 'N/A'}
  - Priority: ${item.priority}
  - Reason: ${item.reason}
`).join('')}

Generate a complete, professional Delta Analysis Report following the template structure. Include:
1. Executive Summary with estimated supplement value range
2. Missing Items table (Critical and High Priority)
3. Quantity corrections if any are identified
4. Defense notes for each item
5. Evidence summary

Format in clean markdown. Be specific with quantities based on available measurements. Use code citations throughout.`

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''
  
  return {
    type: 'delta_analysis',
    title: `Delta Analysis - ${context.clientName}`,
    content,
    contentJson: {
      missedItems: missedItems.map(i => ({
        code: i.code,
        name: i.name,
        ircCode: i.ircCode,
        priority: i.priority,
        defenseNote: i.defenseNote
      })),
      measurements: context.measurements,
      generatedAt: new Date().toISOString()
    },
    projectId: context.projectId,
    generatedBy: 'claude-sonnet-4-20250514'
  }
}

/**
 * Generate a cover letter for carrier submission
 */
export async function generateCoverLetter(context: ProjectContext): Promise<GeneratedDocument> {
  const missedItems = identifyMissedItems(context)
  
  const prompt = `You are an expert roofing supplement estimator. Generate a professional Cover Letter for submitting a supplement to an insurance carrier.

## Project Context
- **Client:** ${context.clientName}
- **Address:** ${context.address}
- **Carrier:** ${context.carrierName || '[Carrier Name]'}
- **Claim #:** ${context.claimNumber || '[Claim Number]'}
- **Adjuster:** ${context.adjusterName || '[Adjuster Name]'}

## Key Items to Include in Supplement
${missedItems.slice(0, 8).map(item => `
- ${item.name} (${item.code}) - ${item.ircCode ? `IRC ${item.ircCode}` : 'Required per manufacturer'} - ${item.reason}
`).join('')}

## Measurements (if available)
${context.measurements ? `
- Total Eave + Rake: ${(context.measurements.eaves || 0) + (context.measurements.rakes || 0)} LF
- Valleys: ${context.measurements.valleys || 0} LF
- Ridge + Hips: ${(context.measurements.ridges || 0) + (context.measurements.hips || 0)} LF
` : 'See attached measurement report'}

Generate a professional cover letter/email that:
1. Has a clear subject line with claim # and address
2. Is addressed to the adjuster professionally
3. Lists 5-7 key corrections as bullet points with IRC codes
4. Lists attachments (estimate, photos, measurements, code references)
5. Requests review and sets expectation for 48-hour follow-up
6. Maintains professional, courteous, factual tone
7. Is concise - no fluff

Keep it to about 200-300 words. Construction-focused - no policy discussion.`

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''
  
  return {
    type: 'cover_letter',
    title: `Cover Letter - ${context.clientName}`,
    content,
    contentJson: {
      claimNumber: context.claimNumber,
      carrier: context.carrierName,
      adjuster: context.adjusterName,
      keyItems: missedItems.slice(0, 8).map(i => i.name),
      generatedAt: new Date().toISOString()
    },
    projectId: context.projectId,
    generatedBy: 'claude-sonnet-4-20250514'
  }
}

/**
 * Generate defense notes for line items
 */
export async function generateDefenseNotes(context: ProjectContext): Promise<GeneratedDocument> {
  const missedItems = identifyMissedItems(context)
  
  const prompt = `You are an expert roofing supplement estimator. Generate professional Defense Notes for Xactimate line items.

${getKnowledgeSummary()}

## Project Context
- **Address:** ${context.address}
- **Pitch:** ${context.pitch || 'See photos'}
- **Stories:** ${context.stories || 'See photos'}

## Measurements
${context.measurements ? `
- Eaves: ${context.measurements.eaves || 0} LF
- Rakes: ${context.measurements.rakes || 0} LF
- Valleys: ${context.measurements.valleys || 0} LF
- Ridge: ${context.measurements.ridges || 0} LF
- Hips: ${context.measurements.hips || 0} LF
` : 'See measurement report'}

## Items Needing Defense Notes
${missedItems.map(item => `
### ${item.code} - ${item.name}
- IRC Code: ${item.ircCode || 'N/A'}
- Base Note: ${item.defenseNote}
`).join('\n')}

Generate complete, copy-ready defense notes for EACH item above. Each note should:
1. Be 2-3 sentences maximum
2. Include the specific IRC code citation if applicable
3. Reference the quantity basis (measurement report)
4. Be factual and professional - no subjective language
5. Be ready to paste directly into Xactimate line item notes

Format as a markdown document with each item as a section. Include the Xactimate code and quantity after each item header.`

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''
  
  return {
    type: 'defense_notes',
    title: `Defense Notes - ${context.clientName}`,
    content,
    contentJson: {
      items: missedItems.map(i => ({
        code: i.code,
        name: i.name,
        ircCode: i.ircCode,
        defenseNote: i.defenseNote
      })),
      generatedAt: new Date().toISOString()
    },
    projectId: context.projectId,
    generatedBy: 'claude-sonnet-4-20250514'
  }
}

/**
 * Generate a comprehensive supplement letter
 */
export async function generateSupplementLetter(context: ProjectContext): Promise<GeneratedDocument> {
  const missedItems = identifyMissedItems(context)
  
  const prompt = `You are an expert roofing supplement estimator. Generate a comprehensive Supplement Letter.

${getKnowledgeSummary()}

## Project Context
- **Client:** ${context.clientName}
- **Address:** ${context.address}
- **Carrier:** ${context.carrierName || '[Carrier Name]'}
- **Claim #:** ${context.claimNumber || '[Claim Number]'}
- **Date of Loss:** ${context.dateOfLoss ? new Date(context.dateOfLoss).toLocaleDateString() : '[Date]'}
- **Adjuster:** ${context.adjusterName || '[Adjuster Name]'}
- **Roof Squares:** ${context.roofSquares || 'Per measurement'}
- **Pitch:** ${context.pitch || 'See photos'}
- **Stories:** ${context.stories || 'See photos'}

## Current Carrier Scope
${context.carrierScope ? `
Total RCV: $${context.carrierScope.totalRCV.toLocaleString()}
` : 'Pending'}

## Measurements
${context.measurements ? `
- Eaves: ${context.measurements.eaves || 0} LF
- Rakes: ${context.measurements.rakes || 0} LF
- Valleys: ${context.measurements.valleys || 0} LF
- Ridge: ${context.measurements.ridges || 0} LF
- Hips: ${context.measurements.hips || 0} LF
- Step Flashing: ${context.measurements.stepFlashing || 0} LF
` : 'See attached measurement report'}

## Items to Include
${missedItems.map(item => {
  const xactInfo = XACTIMATE_CODES.find(x => x.code === item.code)
  return `
### ${item.name} (${item.code})
- IRC: ${item.ircCode || 'Manufacturer requirement'}
- Priority: ${item.priority}
- Avg Price: ${xactInfo ? `$${xactInfo.avgPrice}/${xactInfo.unit}` : 'Per price list'}
- Defense: ${item.defenseNote}
`
}).join('')}

Generate a comprehensive, professional Supplement Letter that includes:
1. Header with all claim information
2. Executive summary (2-3 paragraphs)
3. Items Summary Table (markdown table with #, Item, Code, Xactimate, Qty, Unit, Est. RCV)
4. Detailed section for each item with full defense note
5. Total supplement request amount (estimate based on quantities and prices)
6. Photo evidence references
7. Professional closing

This should be a complete, ready-to-submit document. Be specific with quantities and calculations.`

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 6000,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''
  
  return {
    type: 'supplement_letter',
    title: `Supplement Letter - ${context.clientName}`,
    content,
    contentJson: {
      claimNumber: context.claimNumber,
      carrier: context.carrierName,
      items: missedItems.map(i => ({
        code: i.code,
        name: i.name,
        priority: i.priority
      })),
      generatedAt: new Date().toISOString()
    },
    projectId: context.projectId,
    generatedBy: 'claude-sonnet-4-20250514'
  }
}

/**
 * Generate a rebuttal response to a carrier objection
 */
export async function generateRebuttal(
  context: ProjectContext,
  objection: string,
  itemCode: string
): Promise<GeneratedDocument> {
  const item = COMMONLY_MISSED_ITEMS.find(i => i.code === itemCode)
  const xactInfo = XACTIMATE_CODES.find(x => x.code === itemCode)
  const ircInfo = item?.ircCode ? IRC_ROOFING_CODES.find(c => c.code === item.ircCode) : null

  const prompt = `You are an expert roofing supplement estimator. Generate a professional Rebuttal Response to a carrier objection.

${getKnowledgeSummary()}

## Context
- **Claim #:** ${context.claimNumber || '[Claim Number]'}
- **Address:** ${context.address}

## Item in Question
- **Code:** ${itemCode}
- **Description:** ${xactInfo?.description || item?.name || itemCode}
- **IRC Reference:** ${item?.ircCode || 'N/A'}
${ircInfo ? `- **IRC Requirement:** ${ircInfo.requirement}
- **IRC Full Text:** ${ircInfo.fullText}` : ''}

## Carrier Objection
"${objection}"

## Base Defense Note
${item?.defenseNote || 'No template available'}

Generate a professional rebuttal that:
1. Quotes the carrier's objection exactly
2. Provides a 2-4 sentence response
3. Cites the specific IRC code and/or manufacturer requirement
4. References photo evidence if applicable
5. Requests the item be approved as submitted
6. Maintains professional, courteous, factual tone
7. Stays construction-focused - NO policy interpretation

The response should be ready to send as-is.`

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''
  
  return {
    type: 'rebuttal',
    title: `Rebuttal - ${itemCode} - ${context.clientName}`,
    content,
    contentJson: {
      itemCode,
      objection,
      ircCode: item?.ircCode,
      generatedAt: new Date().toISOString()
    },
    projectId: context.projectId,
    generatedBy: 'claude-sonnet-4-20250514'
  }
}

/**
 * Generate a project brief
 */
export async function generateProjectBrief(context: ProjectContext): Promise<GeneratedDocument> {
  const prompt = `Generate a concise Project Brief for:

## Project Information
- **Client:** ${context.clientName}
- **Address:** ${context.address}
- **Project Type:** ${context.projectType}
- **Carrier:** ${context.carrierName || 'TBD'}
- **Claim #:** ${context.claimNumber || 'TBD'}
- **Roof Squares:** ${context.roofSquares || 'Pending measurement'}
- **Pitch:** ${context.pitch || 'Pending inspection'}
- **Stories:** ${context.stories || 'Pending inspection'}

Generate a clean, professional Project Brief in markdown format with:
1. Header with client name and address
2. Overview section with project type, carrier, claim info
3. Property details section
4. Scope summary (based on project type)
5. Timeline table with key milestones
6. Next steps section

Keep it concise - one page max.`

  const response = await getAnthropicClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  })

  const content = response.content[0].type === 'text' ? response.content[0].text : ''
  
  return {
    type: 'project_brief',
    title: `Project Brief - ${context.clientName}`,
    content,
    contentJson: {
      clientName: context.clientName,
      address: context.address,
      projectType: context.projectType,
      generatedAt: new Date().toISOString()
    },
    projectId: context.projectId,
    generatedBy: 'claude-sonnet-4-20250514'
  }
}

/**
 * Save generated document to database (AI Docs tab)
 */
export async function saveDocument(doc: GeneratedDocument): Promise<string> {
  const saved = await db.document.create({
    data: {
      projectId: doc.projectId,
      type: doc.type,
      title: doc.title,
      content: {
        markdown: doc.content,
        ...doc.contentJson
      },
      status: 'published',
      generatedBy: doc.generatedBy
    }
  })
  
  return saved.id
}

/**
 * Helper: Identify likely missed items based on project context
 */
function identifyMissedItems(context: ProjectContext) {
  const missedItems = [...COMMONLY_MISSED_ITEMS]
  
  // Filter based on context
  const filtered = missedItems.filter(item => {
    // Always include critical items
    if (item.priority === 'critical') return true
    
    // Include steep charges if pitch is documented and steep
    if (item.code === 'RFGSTEEP' && context.pitch) {
      const pitchNum = parseInt(context.pitch.split('/')[0])
      return pitchNum >= 7
    }
    
    // Include high charges if 2+ stories
    if (item.code === 'RFGHIGH+' && context.stories) {
      return context.stories >= 2
    }
    
    // Include most high priority items
    if (item.priority === 'high') return true
    
    return false
  })
  
  return filtered
}

/**
 * Load project context from database
 */
export async function loadProjectContext(projectId: string): Promise<ProjectContext | null> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      uploads: {
        where: { mimeType: { startsWith: 'image/' } },
        select: {
          id: true,
          fileUrl: true,
          category: true,
          tags: true,
          description: true
        }
      },
      claim: {
        include: {
          carrierScopes: {
            orderBy: { version: 'desc' },
            take: 1,
            include: {
              lineItems: true
            }
          }
        }
      }
    }
  })
  
  if (!project) return null
  
  const scope = project.claim?.carrierScopes[0]
  
  return {
    projectId: project.id,
    clientName: project.clientName,
    address: project.address,
    projectType: project.projectType,
    carrierName: project.claim?.carrier || undefined,
    claimNumber: project.claim?.claimNumber || undefined,
    dateOfLoss: project.claim?.dateOfLoss || undefined,
    adjusterName: project.claim?.adjusterName || undefined,
    carrierScope: scope ? {
      totalRCV: scope.totalRCV,
      lineItems: scope.lineItems.map(li => ({
        code: li.xactimateCode || undefined,
        description: li.description,
        quantity: li.quantity,
        unit: li.unit,
        rcv: li.rcv
      }))
    } : undefined,
    photos: project.uploads.map(u => ({
      id: u.id,
      url: u.fileUrl,
      category: u.category || undefined,
      tags: u.tags,
      description: u.description || undefined
    })),
    roofSquares: scope?.totalSquares || undefined,
    measurements: {
      totalSquares: scope?.totalSquares || undefined
    }
  }
}
