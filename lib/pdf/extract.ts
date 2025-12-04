/**
 * Serverless PDF Text Extraction
 * 
 * Uses pdfjs-serverless - a serverless-compatible redistribution of Mozilla's PDF.js
 * specifically designed for Vercel Edge Runtime and other serverless environments.
 */

import { getDocument } from 'pdfjs-serverless'

/**
 * Extract text from a PDF buffer
 */
export async function extractTextFromPdf(buffer: Buffer | ArrayBuffer): Promise<{
  text: string
  pageCount: number
  method: 'pdfjs-serverless' | 'failed'
  error?: string
}> {
  try {
    // Convert Buffer to Uint8Array for pdfjs-serverless
    let data: Uint8Array
    if (buffer instanceof ArrayBuffer) {
      data = new Uint8Array(buffer)
    } else {
      data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    }
    
    // Load the PDF document
    const pdfDocument = await getDocument({ data }).promise
    
    const textParts: string[] = []
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      // Extract text from items - use type assertion for items with str property
      const pageText = (textContent.items as Array<{ str?: string }>)
        .map((item) => item.str || '')
        .filter(Boolean)
        .join(' ')
      
      if (pageText.trim()) {
        textParts.push(pageText)
      }
    }
    
    const fullText = textParts.join('\n\n')
    
    if (fullText.trim().length > 0) {
      return {
        text: fullText.trim(),
        pageCount: pdfDocument.numPages,
        method: 'pdfjs-serverless',
      }
    }
    
    return {
      text: '',
      pageCount: pdfDocument.numPages,
      method: 'failed',
      error: 'PDF contains no extractable text (may be scanned/image-only)',
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
 * Extract text from a PDF URL
 */
export async function extractTextFromPdfUrl(url: string): Promise<{
  text: string
  pageCount: number
  method: 'pdfjs-serverless' | 'failed'
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
    
    return await extractTextFromPdf(arrayBuffer)
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
