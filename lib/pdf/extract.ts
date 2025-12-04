/**
 * Robust PDF Text Extraction
 * 
 * Uses Mozilla PDF.js (pdfjs-dist) as primary extractor - pure JavaScript, works everywhere.
 */

/**
 * Extract text from a PDF buffer using PDF.js
 * This is a pure JavaScript implementation that works in all environments.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<{
  text: string
  pageCount: number
  method: 'pdfjs' | 'failed'
  error?: string
}> {
  try {
    const result = await extractWithPdfJs(buffer)
    
    if (result.text && result.text.trim().length > 0) {
      return {
        text: result.text.trim(),
        pageCount: result.pageCount,
        method: 'pdfjs',
      }
    }
    
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
      error: 'PDF appears to be empty or contains only images without text',
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown PDF parsing error'
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
      error: errorMsg,
    }
  }
}

/**
 * Extract text using PDF.js (Mozilla's PDF library)
 * Pure JavaScript - works in Node.js, Edge, and browser
 */
async function extractWithPdfJs(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  // Dynamic import - use the getDocument export directly
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  
  // Load the PDF document
  const uint8Array = new Uint8Array(buffer)
  const loadingTask = getDocument({
    data: uint8Array,
    useSystemFonts: true,
  })
  
  const pdf = await loadingTask.promise
  const textParts: string[] = []
  
  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    
    // Combine text items with proper spacing
    // Filter to items with 'str' property (TextItem, not TextMarkedContent)
    const pageText = (textContent.items as Array<{ str?: string }>)
      .map((item) => item.str || '')
      .filter(Boolean)
      .join(' ')
    
    if (pageText.trim()) {
      textParts.push(pageText)
    }
  }
  
  return {
    text: textParts.join('\n\n'),
    pageCount: pdf.numPages,
  }
}

/**
 * Extract text from a PDF URL
 */
export async function extractTextFromPdfUrl(url: string): Promise<{
  text: string
  pageCount: number
  method: 'pdfjs' | 'failed'
  error?: string
}> {
  try {
    // Fetch the PDF
    const response = await fetch(url)
    if (!response.ok) {
      return {
        text: '',
        pageCount: 0,
        method: 'failed',
        error: `Failed to download PDF (HTTP ${response.status})`,
      }
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    return await extractTextFromPdf(buffer)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
      error: `PDF extraction failed: ${errorMsg}`,
    }
  }
}
