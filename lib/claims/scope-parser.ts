import { openai } from '@/lib/ai/openai'
import { ParsedScopeSchema, type ParsedScope } from './schemas'
import { ROOFING_CODES } from './xactimate-codes'

/**
 * Parse carrier scope PDF text and extract structured line item data
 * Uses GPT-4o to understand Xactimate-style scope documents
 */
export async function parseCarrierScope(scopeText: string): Promise<ParsedScope> {
  // Build Xactimate code reference for the prompt
  const codeReference = ROOFING_CODES.slice(0, 30) // Top codes for context
    .map(c => `${c.code}: ${c.description} (${c.unit})`)
    .join('\n')

  const systemPrompt = `You are an expert insurance claims analyst specializing in Xactimate scope documents.
Your task is to extract structured data from carrier scope PDFs (Statement of Loss documents).

Key terminology:
- RCV = Replacement Cost Value (full cost to replace)
- ACV = Actual Cash Value (RCV minus depreciation)
- O&P = Overhead & Profit (typically 10%/10% = 20% on subtotal)
- SQ = Square (100 square feet of roofing)
- LF = Linear Feet
- EA = Each

Common Xactimate roofing codes (use these when you can match descriptions):
${codeReference}

Return strictly valid JSON matching the schema. Extract ALL line items you find.
If a value is not clearly stated, omit it rather than guessing.`

  const userPrompt = `Parse this carrier scope document and extract all data:

"""
${scopeText.slice(0, 30000)}
"""

Return JSON with this structure:
{
  "claimNumber": string or null,
  "dateOfLoss": "YYYY-MM-DD" or null,
  "policyNumber": string or null,
  "carrier": string or null,
  "adjusterName": string or null,
  "insuredName": string or null,
  "propertyAddress": string or null,
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
  "tradeSummaries": [
    { "trade": string, "rcv": number, "tax": number, "overheadProfit": number, "depreciation": number, "acv": number }
  ],
  "lineItems": [
    {
      "lineNumber": number or null,
      "xactimateCode": string or null (match to known codes if possible),
      "description": string,
      "category": "roofing" | "painting" | "drywall" | "carpet" | "gutters" | "siding" | "interior" | "other",
      "trade": string or null,
      "area": string or null (e.g., "Main Roof", "Front Elevation"),
      "quantity": number,
      "unit": "SQ" | "LF" | "SF" | "EA" | "HR" | etc,
      "unitPrice": number,
      "tax": number,
      "overheadProfit": number,
      "rcv": number,
      "ageLife": "X/Y" or null (e.g., "5/20"),
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
- Parse Age/Life format like "5/20" (5 years old, 20 year life)`

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

  const parsed = JSON.parse(content)
  
  // Validate and coerce with Zod
  const validated = ParsedScopeSchema.parse(parsed)
  
  // Calculate D$/SQ if not provided
  if (validated.roofMetrics?.totalSquares && !validated.roofMetrics.dollarPerSquare) {
    // Sum roofing line items RCV
    const roofingRCV = validated.lineItems
      .filter(item => item.category === 'roofing')
      .reduce((sum, item) => sum + item.rcv, 0)
    
    if (roofingRCV > 0) {
      validated.roofMetrics.dollarPerSquare = Math.round(
        (roofingRCV / validated.roofMetrics.totalSquares) * 100
      ) / 100
    }
  }

  return validated
}

/**
 * Detect if text appears to be from an Xactimate scope document
 */
export function isXactimateScope(text: string): boolean {
  const xactimateIndicators = [
    'xactimate',
    'replacement cost value',
    'actual cash value',
    'rcv',
    'acv',
    'overhead',
    'profit',
    /\d+\.\d{2}\s*(SQ|LF|SF|EA)/i, // Unit patterns
    'dwelling',
    'deductible',
  ]

  const lowerText = text.toLowerCase()
  const matchCount = xactimateIndicators.filter(indicator => {
    if (typeof indicator === 'string') {
      return lowerText.includes(indicator)
    }
    return indicator.test(text)
  }).length

  return matchCount >= 3
}

/**
 * Calculate metrics from parsed scope
 */
export function calculateScopeMetrics(scope: ParsedScope) {
  const roofingItems = scope.lineItems.filter(i => i.category === 'roofing')
  const roofingRCV = roofingItems.reduce((sum, i) => sum + i.rcv, 0)
  const roofingACV = roofingItems.reduce((sum, i) => sum + i.acv, 0)
  
  // Try to find total squares from line items
  let totalSquares = scope.roofMetrics?.totalSquares
  if (!totalSquares) {
    // Look for shingle line items to estimate squares
    const shingleItem = roofingItems.find(i => 
      i.description.toLowerCase().includes('shingle') && 
      i.unit === 'SQ'
    )
    if (shingleItem) {
      totalSquares = shingleItem.quantity
    }
  }

  const dollarPerSquare = totalSquares && totalSquares > 0
    ? Math.round((roofingRCV / totalSquares) * 100) / 100
    : null

  return {
    roofingRCV,
    roofingACV,
    roofingDepreciation: roofingRCV - roofingACV,
    totalSquares,
    dollarPerSquare,
    lineItemCount: scope.lineItems.length,
    roofingLineItemCount: roofingItems.length,
    categories: [...new Set(scope.lineItems.map(i => i.category))],
  }
}

/**
 * Identify potentially missing items by comparing scope to common requirements
 */
export function identifyMissingItems(scope: ParsedScope): string[] {
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
    missing.push('Starter Course (R904.1)')
  }

  // Check for hip/ridge cap
  const hasRidgeCap = codes.some(c => c?.startsWith('RFGRIDG')) ||
    descriptions.some(d => d.includes('ridge') || d.includes('hip'))
  if (!hasRidgeCap) {
    missing.push('Hip/Ridge Cap')
  }

  // Check for ice & water in valleys (if valleys exist)
  const hasValleyMetal = descriptions.some(d => d.includes('valley'))
  const hasIWS = codes.includes('RFGIWS') ||
    descriptions.some(d => d.includes('ice') && d.includes('water'))
  if (hasValleyMetal && !hasIWS) {
    missing.push('Ice & Water Shield in Valleys (R905.2.8.2)')
  }

  // Check for steep charges based on pitch
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
