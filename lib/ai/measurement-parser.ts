/**
 * Measurement Report Parser
 * 
 * AI-powered parsing for EagleView, HOVER, and GAF QuickMeasure PDFs.
 * Extracts roof measurements, dimensions, and calculations.
 */

import { openai } from './openai'

export interface MeasurementData {
  totalSquares: number
  pitch: string | null
  ridgeLength: number | null
  hipLength: number | null
  valleyLength: number | null
  eaveLength: number | null
  rakeLength: number | null
  wastePercent: number | null
  reportType: 'eagleview' | 'hover' | 'gaf_quickmeasure' | 'unknown'
  rawFields: Record<string, string | number>
}

/**
 * Parse a measurement report PDF and extract roof data
 */
export async function parseMeasurementReport(
  pdfText: string
): Promise<{ success: boolean; data?: MeasurementData; message: string }> {
  const systemPrompt = `You are a measurement report parser specializing in roof measurement reports from EagleView, HOVER, and GAF QuickMeasure.

Extract roof measurements from the provided report text.

Return JSON with these fields:
- totalSquares: number (total roof area in squares, where 1 square = 100 sq ft)
- pitch: string (e.g., "6/12", "8/12") - the predominant roof pitch
- ridgeLength: number (total ridge linear feet)
- hipLength: number (total hip linear feet)
- valleyLength: number (total valley linear feet)
- eaveLength: number (total eave/drip edge linear feet)
- rakeLength: number (total rake linear feet)
- wastePercent: number (suggested waste percentage)
- reportType: "eagleview" | "hover" | "gaf_quickmeasure" | "unknown"
- rawFields: object with any other relevant measurements found

Key patterns to look for:
- EagleView reports typically show "Total Squares", "Predominant Pitch", and measurements for each roof facet
- HOVER reports show area, pitch, and linear measurements in detailed tables
- GAF QuickMeasure shows similar fields with slightly different terminology

If a field cannot be determined from the text, use null.
Convert all area measurements to squares (divide sq ft by 100).
Convert linear measurements to feet if given in inches.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Parse this measurement report:\n\n${pdfText.slice(0, 30000)}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    })
    
    const content = response.choices[0]?.message?.content
    if (!content) {
      return {
        success: false,
        message: 'No response from AI parser',
      }
    }
    
    const data = JSON.parse(content) as MeasurementData
    
    // Validate we got at least total squares
    if (!data.totalSquares || data.totalSquares <= 0) {
      return {
        success: false,
        message: 'Could not extract total squares from measurement report',
      }
    }
    
    return {
      success: true,
      data,
      message: `Parsed ${data.reportType} report: ${data.totalSquares} squares${data.pitch ? ` at ${data.pitch} pitch` : ''}`,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to parse measurement report',
    }
  }
}

/**
 * Parse a measurement report from a URL
 */
export async function parseMeasurementReportFromUrl(
  fileUrl: string
): Promise<{ success: boolean; data?: MeasurementData; message: string }> {
  try {
    // Step 1: Download the PDF
    let response: Response
    try {
      response = await fetch(fileUrl)
    } catch (fetchError) {
      return {
        success: false,
        message: 'Could not download PDF file. Please try re-uploading.',
      }
    }
    
    if (!response.ok) {
      return {
        success: false,
        message: `Failed to download PDF (HTTP ${response.status}). Please try re-uploading the file.`,
      }
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Step 2: Extract text from PDF
    let pdfText: string
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod: any = await import('pdf-parse')
      const pdfParse = mod.default || mod
      const pdfData = await pdfParse(buffer)
      pdfText = pdfData.text
    } catch (parseError) {
      const parseErrorMsg = parseError instanceof Error ? parseError.message : 'unknown'
      return {
        success: false,
        message: `Could not read PDF content. The file may be corrupted, encrypted, or in an unsupported format. (${parseErrorMsg})`,
      }
    }
    
    if (!pdfText || pdfText.length < 50) {
      return {
        success: false,
        message: 'PDF appears to be empty or unreadable. It may be a scanned image without OCR text.',
      }
    }
    
    return await parseMeasurementReport(pdfText)
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to parse measurement report',
    }
  }
}

/**
 * Calculate additional line items from measurement data
 */
export function calculateSupplementItems(data: MeasurementData): Array<{
  description: string
  xactimateCode: string
  quantity: number
  unit: string
  basis: string
}> {
  const items: Array<{
    description: string
    xactimateCode: string
    quantity: number
    unit: string
    basis: string
  }> = []
  
  // Drip Edge (eaves + rakes)
  if (data.eaveLength || data.rakeLength) {
    const dripEdgeLF = (data.eaveLength || 0) + (data.rakeLength || 0)
    if (dripEdgeLF > 0) {
      items.push({
        description: 'Drip Edge',
        xactimateCode: 'RFGDRIP',
        quantity: Math.ceil(dripEdgeLF),
        unit: 'LF',
        basis: `Eave (${data.eaveLength || 0} LF) + Rake (${data.rakeLength || 0} LF)`,
      })
    }
  }
  
  // Starter Strip (eaves + rakes)
  if (data.eaveLength || data.rakeLength) {
    const starterLF = (data.eaveLength || 0) + (data.rakeLength || 0)
    if (starterLF > 0) {
      items.push({
        description: 'Starter Strip',
        xactimateCode: 'RFGASTR',
        quantity: Math.ceil(starterLF),
        unit: 'LF',
        basis: `Eave (${data.eaveLength || 0} LF) + Rake (${data.rakeLength || 0} LF)`,
      })
    }
  }
  
  // Hip/Ridge Cap (hips + ridges)
  if (data.hipLength || data.ridgeLength) {
    const ridgeCapLF = (data.hipLength || 0) + (data.ridgeLength || 0)
    if (ridgeCapLF > 0) {
      items.push({
        description: 'Hip/Ridge Cap Shingles',
        xactimateCode: 'RFGRIDGC',
        quantity: Math.ceil(ridgeCapLF),
        unit: 'LF',
        basis: `Hip (${data.hipLength || 0} LF) + Ridge (${data.ridgeLength || 0} LF)`,
      })
    }
  }
  
  // Valley Metal/Ice & Water
  if (data.valleyLength && data.valleyLength > 0) {
    items.push({
      description: 'Valley Metal',
      xactimateCode: 'RFGVMTLW',
      quantity: Math.ceil(data.valleyLength),
      unit: 'LF',
      basis: `Valley length from measurement report`,
    })
    
    // Ice & Water in valleys (typically 3 ft wide)
    const iwsValleyArea = Math.ceil((data.valleyLength * 3) / 100 * 10) / 10 // Convert to squares, round to 0.1
    items.push({
      description: 'Ice & Water Shield - Valleys',
      xactimateCode: 'RFGIWS',
      quantity: iwsValleyArea,
      unit: 'SQ',
      basis: `Valley (${data.valleyLength} LF) × 3 ft width`,
    })
  }
  
  return items
}
