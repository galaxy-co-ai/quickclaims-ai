/**
 * AI Scope Parser
 * 
 * Parses carrier scope PDFs from file URLs, extracts all data using GPT-4,
 * and stores it in the database. Designed for automatic processing when files are uploaded.
 */

import { openai } from './openai'
import { db } from '@/lib/db'

/**
 * Extract scope metadata without storing in database
 * Used for one-shot workflow to get address before creating project
 */
export async function extractScopeMetadata(
  fileUrl: string
): Promise<{
  success: boolean
  message: string
  data?: {
    propertyAddress: string | null
    insuredName: string | null
    carrier: string | null
    claimNumber: string | null
    dateOfLoss: string | null
    totalRCV: number
    totalSquares: number | null
  }
}> {
  try {
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const mod = await import('pdf-parse')
    const pdfParse = mod.default || mod
    const pdfData = await pdfParse(buffer)
    const scopeText = pdfData.text
    
    if (!scopeText || scopeText.length < 100) {
      return {
        success: false,
        message: 'PDF appears to be empty or unreadable',
      }
    }
    
    const extracted = await extractScopeData(scopeText)
    
    return {
      success: true,
      message: 'Extracted scope metadata',
      data: {
        propertyAddress: extracted.propertyAddress || null,
        insuredName: extracted.insuredName || null,
        carrier: extracted.carrier || null,
        claimNumber: extracted.claimNumber || null,
        dateOfLoss: extracted.dateOfLoss || null,
        totalRCV: extracted.totals.rcv || 0,
        totalSquares: extracted.roofMetrics?.totalSquares || null,
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to extract scope metadata: ${errorMessage}`,
    }
  }
}

/**
 * Parse a carrier scope PDF from a URL and store in database
 */
export async function parseCarrierScopeFromUrl(
  fileUrl: string,
  projectId: string,
  userId: string
): Promise<{
  success: boolean
  message: string
  data?: {
    claimId: string
    scopeId: string
    lineItemsCount: number
    totalRCV: number
    dollarPerSquare: number | null
    missingItems: string[]
    extractedAddress?: string | null
    extractedClientName?: string | null
  }
}> {
  try {
    // Download the PDF
    const response = await fetch(fileUrl)
    if (!response.ok) {
      throw new Error(`Failed to download PDF: ${response.statusText}`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Extract text from PDF
    const mod = await import('pdf-parse')
    const pdfParse: any = mod.default || mod
    const pdfData = await pdfParse(buffer)
    const scopeText = pdfData.text
    
    if (!scopeText || scopeText.length < 100) {
      return {
        success: false,
        message: 'PDF appears to be empty or unreadable',
      }
    }
    
    // Use GPT-4 to extract structured data
    const extracted = await extractScopeData(scopeText)
    
    // Get or create claim for this project
    let claim = await db.claim.findUnique({
      where: { projectId },
    })
    
    if (!claim) {
      claim = await db.claim.create({
        data: {
          projectId,
          carrier: extracted.carrier || undefined,
          claimNumber: extracted.claimNumber || undefined,
          dateOfLoss: extracted.dateOfLoss ? new Date(extracted.dateOfLoss) : undefined,
          adjusterName: extracted.adjusterName || undefined,
          adjusterEmail: extracted.adjusterEmail || undefined,
          adjusterPhone: extracted.adjusterPhone || undefined,
          status: 'scope_review',
        },
      })
    } else {
      // Update existing claim with new info
      claim = await db.claim.update({
        where: { id: claim.id },
        data: {
          carrier: extracted.carrier || claim.carrier,
          claimNumber: extracted.claimNumber || claim.claimNumber,
          dateOfLoss: extracted.dateOfLoss ? new Date(extracted.dateOfLoss) : claim.dateOfLoss,
          adjusterName: extracted.adjusterName || claim.adjusterName,
          adjusterEmail: extracted.adjusterEmail || claim.adjusterEmail,
          adjusterPhone: extracted.adjusterPhone || claim.adjusterPhone,
        },
      })
    }
    
    // Find the latest scope version
    const latestScope = await db.carrierScope.findFirst({
      where: { claimId: claim.id },
      orderBy: { version: 'desc' },
    })
    
    const nextVersion = latestScope ? latestScope.version + 1 : 1
    
    // Create carrier scope
    const carrierScope = await db.carrierScope.create({
      data: {
        claimId: claim.id,
        version: nextVersion,
        totalRCV: extracted.totals.rcv || 0,
        totalACV: extracted.totals.acv || 0,
        totalDepreciation: extracted.totals.depreciation || 0,
        totalTax: extracted.totals.tax || 0,
        totalOP: extracted.totals.overheadProfit || 0,
        deductible: extracted.totals.deductible || 0,
        netPayment: extracted.totals.netPayment || 0,
        totalSquares: extracted.roofMetrics?.totalSquares || null,
        dollarPerSquare: extracted.roofMetrics?.dollarPerSquare || null,
        dwellingRCV: extracted.coverages?.find(c => c.type === 'Dwelling')?.rcv || null,
        otherStructuresRCV: extracted.coverages?.find(c => c.type === 'Other Structures')?.rcv || null,
        rawText: scopeText,
      },
    })
    
    // Create line items
    const lineItems = await Promise.all(
      extracted.lineItems.map((item) =>
        db.lineItem.create({
          data: {
            scopeId: carrierScope.id,
            lineNumber: item.lineNumber || null,
            xactimateCode: item.xactimateCode || null,
            description: item.description,
            category: item.category,
            trade: item.trade || null,
            area: item.area || null,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice || 0,
            tax: item.tax || 0,
            overheadProfit: item.overheadProfit || 0,
            rcv: item.rcv || 0,
            ageLife: item.ageLife || null,
            depreciationPct: item.depreciationPct || null,
            depreciation: item.depreciation || 0,
            acv: item.acv || 0,
          },
        })
      )
    )
    
    // Identify missing items
    const missingItems = identifyMissingItems(extracted)
    
    // Update project address if we extracted one and it's different
    if (extracted.propertyAddress) {
      const project = await db.project.findUnique({
        where: { id: projectId },
      })
      
      if (project && project.address !== extracted.propertyAddress) {
        await db.project.update({
          where: { id: projectId },
          data: { address: extracted.propertyAddress },
        })
      }
    }
    
    // Create activity log entry
    await db.claimActivity.create({
      data: {
        claimId: claim.id,
        action: 'scope_parsed',
        description: `Parsed carrier scope v${nextVersion} with ${lineItems.length} line items`,
        details: {
          lineItemsCount: lineItems.length,
          totalRCV: carrierScope.totalRCV,
          dollarPerSquare: carrierScope.dollarPerSquare,
        },
      },
    })
    
    return {
      success: true,
      message: `Parsed scope: ${lineItems.length} line items, $${carrierScope.totalRCV.toLocaleString()} RCV${carrierScope.dollarPerSquare ? `, $${carrierScope.dollarPerSquare} D/SQ` : ''}`,
      data: {
        claimId: claim.id,
        scopeId: carrierScope.id,
        lineItemsCount: lineItems.length,
        totalRCV: carrierScope.totalRCV,
        dollarPerSquare: carrierScope.dollarPerSquare,
        missingItems,
        extractedAddress: extracted.propertyAddress,
        extractedClientName: extracted.insuredName,
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to parse scope: ${errorMessage}`,
    }
  }
}

/**
 * Extract structured data from scope text using GPT-4
 */
async function extractScopeData(scopeText: string): Promise<ExtractedScopeData> {
  const systemPrompt = `You are an expert insurance claims analyst specializing in Xactimate scope documents.
Extract structured data from carrier scope PDFs (Statement of Loss documents).

Key terminology:
- RCV = Replacement Cost Value (full cost to replace)
- ACV = Actual Cash Value (RCV minus depreciation)
- O&P = Overhead & Profit (typically 10%/10% = 20% on subtotal)
- SQ = Square (100 square feet of roofing)
- LF = Linear Feet
- EA = Each

Return strictly valid JSON. Extract ALL line items you find.
If a value is not clearly stated, use null.`

  const userPrompt = `Parse this carrier scope document and extract all data:

"""
${scopeText.slice(0, 30000)}
"""

Return JSON with this structure:
{
  "claimNumber": string or null,
  "dateOfLoss": "YYYY-MM-DD" or null,
  "carrier": string or null,
  "adjusterName": string or null,
  "adjusterEmail": string or null,
  "adjusterPhone": string or null,
  "insuredName": string or null,
  "propertyAddress": string or null (FULL address: street, city, state, ZIP),
  "coverages": [
    { "type": "Dwelling" or "Other Structures", "rcv": number, "depreciation": number, "acv": number }
  ],
  "totals": {
    "rcv": number,
    "tax": number,
    "overheadProfit": number,
    "depreciation": number,
    "acv": number,
    "deductible": number,
    "netPayment": number
  },
  "roofMetrics": {
    "totalSquares": number or null,
    "dollarPerSquare": number or null,
    "pitch": "X/12" or null,
    "stories": number or null
  },
  "lineItems": [
    {
      "lineNumber": number or null,
      "xactimateCode": string or null,
      "description": string,
      "category": "roofing" | "painting" | "drywall" | "carpet" | "gutters" | "siding" | "interior" | "other",
      "trade": string or null,
      "area": string or null,
      "quantity": number,
      "unit": "SQ" | "LF" | "SF" | "EA" | "HR" | etc,
      "unitPrice": number,
      "tax": number,
      "overheadProfit": number,
      "rcv": number,
      "ageLife": "X/Y" or null,
      "depreciationPct": number or null,
      "depreciation": number,
      "acv": number
    }
  ]
}

Important:
- Extract EVERY line item, not just roofing
- Match descriptions to Xactimate codes when possible
- Calculate dollarPerSquare as roofing RCV / totalSquares if you can determine both
- Include all areas (Main Roof, Garage, Patio, etc.)
- Parse Age/Life format like "5/20" (5 years old, 20 year life)
- Extract FULL property address including city, state, ZIP`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1, // Low temp for accuracy
  })

  const content = completion.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }

  const parsed = JSON.parse(content) as ExtractedScopeData
  
  // Calculate D$/SQ if not provided
  if (parsed.roofMetrics?.totalSquares && !parsed.roofMetrics.dollarPerSquare) {
    const roofingRCV = parsed.lineItems
      .filter(item => item.category === 'roofing')
      .reduce((sum, item) => sum + (item.rcv || 0), 0)
    
    if (roofingRCV > 0 && parsed.roofMetrics.totalSquares > 0) {
      parsed.roofMetrics.dollarPerSquare = Math.round(
        (roofingRCV / parsed.roofMetrics.totalSquares) * 100
      ) / 100
    }
  }

  return parsed
}

/**
 * Identify potentially missing items
 */
function identifyMissingItems(scope: ExtractedScopeData): string[] {
  const missing: string[] = []
  const descriptions = scope.lineItems.map(i => i.description.toLowerCase())
  const codes = scope.lineItems.map(i => i.xactimateCode?.toUpperCase()).filter(Boolean)

  // Check for drip edge
  const hasDripEdge = codes.includes('RFGDRIP') || 
    descriptions.some(d => d.includes('drip edge'))
  if (!hasDripEdge) {
    missing.push('Drip Edge (R905.2.8.5)')
  }

  // Check for starter
  const hasStarter = codes.includes('RFGSTRT') || 
    descriptions.some(d => d.includes('starter'))
  if (!hasStarter) {
    missing.push('Starter Course (R905.2.8.1)')
  }

  // Check for hip/ridge cap
  const hasRidgeCap = codes.some(c => c?.startsWith('RFGRIDG')) ||
    descriptions.some(d => d.includes('ridge') || d.includes('hip'))
  if (!hasRidgeCap) {
    missing.push('Hip/Ridge Cap')
  }

  // Check for ice & water in valleys
  const hasValleyMetal = descriptions.some(d => d.includes('valley'))
  const hasIWS = codes.includes('RFGIWS') ||
    descriptions.some(d => d.includes('ice') && d.includes('water'))
  if (hasValleyMetal && !hasIWS) {
    missing.push('Ice & Water Shield in Valleys (R905.2.8.2)')
  }

  // Check for steep charges
  const pitch = scope.roofMetrics?.pitch
  if (pitch) {
    const pitchNum = parseInt(pitch.split('/')[0])
    if (pitchNum >= 7) {
      const hasSteep = codes.includes('RFGSTEEP') ||
        descriptions.some(d => d.includes('steep'))
      if (!hasSteep) {
        missing.push('Steep Pitch Charges (7/12+)')
      }
    }
  }

  return missing
}

/**
 * Types for extracted scope data
 */
interface ExtractedScopeData {
  claimNumber?: string | null
  dateOfLoss?: string | null
  carrier?: string | null
  adjusterName?: string | null
  adjusterEmail?: string | null
  adjusterPhone?: string | null
  insuredName?: string | null
  propertyAddress?: string | null
  coverages?: Array<{
    type: string
    rcv: number
    depreciation: number
    acv: number
  }>
  totals: {
    rcv: number
    tax: number
    overheadProfit: number
    depreciation: number
    acv: number
    deductible: number
    netPayment: number
  }
  roofMetrics?: {
    totalSquares?: number | null
    dollarPerSquare?: number | null
    pitch?: string | null
    stories?: number | null
  }
  lineItems: Array<{
    lineNumber?: number | null
    xactimateCode?: string | null
    description: string
    category: string
    trade?: string | null
    area?: string | null
    quantity: number
    unit: string
    unitPrice: number
    tax: number
    overheadProfit: number
    rcv: number
    ageLife?: string | null
    depreciationPct?: number | null
    depreciation: number
    acv: number
  }>
}
