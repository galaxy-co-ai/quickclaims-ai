/**
 * Robust PDF Text Extraction
 * 
 * Uses Mozilla PDF.js (pdfjs-dist) as primary extractor - pure JavaScript, works everywhere.
 * Falls back to GPT-4 Vision for scanned/image-based PDFs.
 */

import { openai } from '@/lib/ai/openai'

/**
 * Extract text from a PDF buffer using PDF.js
 * This is a pure JavaScript implementation that works in all environments.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<{
  text: string
  pageCount: number
  method: 'pdfjs' | 'vision' | 'failed'
}> {
  // Try PDF.js first (works for text-based PDFs)
  try {
    const text = await extractWithPdfJs(buffer)
    
    // Check if we got meaningful text (more than 200 chars suggests real content)
    if (text && text.trim().length > 200) {
      return {
        text: text.trim(),
        pageCount: 1, // PDF.js gives us pages but we combine them
        method: 'pdfjs',
      }
    }
    
    // If minimal text, it might be a scanned PDF - try Vision
    const visionText = await extractWithVision(buffer)
    if (visionText && visionText.trim().length > 100) {
      return {
        text: visionText.trim(),
        pageCount: 1,
        method: 'vision',
      }
    }
    
    // Return whatever we got from PDF.js even if minimal
    if (text && text.trim().length > 0) {
      return {
        text: text.trim(),
        pageCount: 1,
        method: 'pdfjs',
      }
    }
    
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
    }
  } catch (error) {
    // PDF.js failed completely, try Vision as fallback
    try {
      const visionText = await extractWithVision(buffer)
      if (visionText && visionText.trim().length > 50) {
        return {
          text: visionText.trim(),
          pageCount: 1,
          method: 'vision',
        }
      }
    } catch {
      // Vision also failed
    }
    
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
    }
  }
}

/**
 * Extract text using PDF.js (Mozilla's PDF library)
 * Pure JavaScript - works in Node.js, Edge, and browser
 */
async function extractWithPdfJs(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid issues with SSR
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  
  // Load the PDF document
  const uint8Array = new Uint8Array(buffer)
  const loadingTask = pdfjsLib.getDocument({
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
    // Use type assertion - items are either TextItem (has str) or TextMarkedContent
    const pageText = (textContent.items as Array<{ str?: string }>)
      .map((item) => item.str || '')
      .filter(Boolean)
      .join(' ')
    
    if (pageText.trim()) {
      textParts.push(pageText)
    }
  }
  
  return textParts.join('\n\n')
}

/**
 * Extract text using GPT-4 Vision (for scanned/image PDFs)
 * Converts first pages to images and uses AI to read them
 */
async function extractWithVision(buffer: Buffer): Promise<string> {
  // Convert PDF buffer to base64 for the API
  const base64 = buffer.toString('base64')
  
  // GPT-4o can actually read PDFs when sent as a file
  // We'll send it as base64 encoded data
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `This is an insurance carrier scope PDF document (Statement of Loss). Extract ALL text content from this document exactly as it appears. Include:
- All headers and titles
- All line items with codes, descriptions, quantities, and prices
- All totals and summaries
- Property address, claim number, dates
- Any notes or comments

Return the raw text content only, preserving the structure as much as possible.`,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:application/pdf;base64,${base64}`,
            },
          },
        ],
      },
    ],
    max_tokens: 4096,
  })
  
  return response.choices[0]?.message?.content || ''
}

/**
 * Extract text from a PDF URL
 */
export async function extractTextFromPdfUrl(url: string): Promise<{
  text: string
  pageCount: number
  method: 'pdfjs' | 'vision' | 'failed'
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
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
