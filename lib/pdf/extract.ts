/**
 * PDF Text Extraction
 * 
 * Uses LlamaParse for fast, accurate extraction (~6 seconds)
 * Falls back to pdfjs-serverless if LlamaParse is not configured
 */

import { extractTextFromUrlWithLlamaParse, extractTextWithLlamaParse } from './llamaparse'
import { getDocument } from 'pdfjs-serverless'

/**
 * Extract text from a PDF buffer
 * Uses LlamaParse if available, falls back to pdfjs-serverless
 */
export async function extractTextFromPdf(buffer: Buffer | ArrayBuffer): Promise<{
  text: string
  pageCount: number
  method: 'llamaparse' | 'pdfjs-serverless' | 'failed'
  error?: string
}> {
  // Try LlamaParse first (faster, more accurate)
  if (process.env.LLAMA_CLOUD_API_KEY) {
    const result = await extractTextWithLlamaParse(buffer)
    if (result.method !== 'failed') {
      return result
    }
    console.log('[PDF] LlamaParse failed, falling back to pdfjs-serverless')
  }
  
  // Fallback to pdfjs-serverless
  return await extractWithPdfJs(buffer)
}

/**
 * Extract text from a PDF URL
 */
export async function extractTextFromPdfUrl(url: string): Promise<{
  text: string
  pageCount: number
  method: 'llamaparse' | 'pdfjs-serverless' | 'failed'
  error?: string
}> {
  // Try LlamaParse first
  if (process.env.LLAMA_CLOUD_API_KEY) {
    const result = await extractTextFromUrlWithLlamaParse(url)
    if (result.method !== 'failed') {
      return result
    }
    console.log('[PDF] LlamaParse failed, falling back to pdfjs-serverless')
  }
  
  // Fallback: download and use pdfjs
  try {
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
    return await extractWithPdfJs(arrayBuffer)
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

/**
 * Fallback extraction using pdfjs-serverless
 */
async function extractWithPdfJs(buffer: Buffer | ArrayBuffer): Promise<{
  text: string
  pageCount: number
  method: 'pdfjs-serverless' | 'failed'
  error?: string
}> {
  try {
    let data: Uint8Array
    if (buffer instanceof ArrayBuffer) {
      data = new Uint8Array(buffer)
    } else {
      data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    }
    
    const pdfDocument = await getDocument({ 
      data,
      disableFontFace: true,
      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
    }).promise
    
    const textParts: string[] = []
    
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum)
      const textContent = await page.getTextContent()
      
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
