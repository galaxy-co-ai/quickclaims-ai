/**
 * LlamaParse PDF Extraction
 * 
 * Production-grade PDF parsing using LlamaIndex's LlamaParse.
 * Much faster and more accurate than pdfjs for text extraction.
 * 
 * Typical processing time: ~6 seconds regardless of document size
 */

import { LlamaParseReader } from 'llamaindex'

// Lazy initialization
let reader: LlamaParseReader | null = null

function getReader(): LlamaParseReader {
  if (!reader) {
    const apiKey = process.env.LLAMA_CLOUD_API_KEY
    if (!apiKey) {
      throw new Error('LLAMA_CLOUD_API_KEY environment variable is required for PDF parsing. Get one free at https://cloud.llamaindex.ai/')
    }
    reader = new LlamaParseReader({ 
      apiKey,
      resultType: 'text', // We just need text, not markdown
    })
  }
  return reader
}

/**
 * Extract text from a PDF buffer using LlamaParse
 */
export async function extractTextWithLlamaParse(buffer: Buffer | ArrayBuffer): Promise<{
  text: string
  pageCount: number
  method: 'llamaparse' | 'failed'
  error?: string
}> {
  const startTime = Date.now()
  console.log('[LlamaParse] Starting PDF extraction...')
  
  try {
    const llamaReader = getReader()
    
    // Convert to Buffer if needed
    const pdfBuffer = buffer instanceof ArrayBuffer 
      ? Buffer.from(buffer) 
      : buffer
    
    // Parse the PDF
    const documents = await llamaReader.loadDataAsContent(pdfBuffer)
    
    // Combine all document text
    const text = documents.map(doc => doc.text).join('\n\n')
    const pageCount = documents.length
    
    console.log(`[LlamaParse] Extraction complete in ${Date.now() - startTime}ms (${pageCount} pages, ${text.length} chars)`)
    
    if (text.trim().length > 0) {
      return {
        text: text.trim(),
        pageCount,
        method: 'llamaparse',
      }
    }
    
    return {
      text: '',
      pageCount,
      method: 'failed',
      error: 'PDF contains no extractable text',
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[LlamaParse] Extraction failed:', errorMsg)
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
      error: errorMsg,
    }
  }
}

/**
 * Extract text from a PDF URL using LlamaParse
 */
export async function extractTextFromUrlWithLlamaParse(url: string): Promise<{
  text: string
  pageCount: number
  method: 'llamaparse' | 'failed'
  error?: string
}> {
  try {
    console.log('[LlamaParse] Downloading PDF from URL...')
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
    return await extractTextWithLlamaParse(arrayBuffer)
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
