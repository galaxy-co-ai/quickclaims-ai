/**
 * LlamaParse PDF Extraction via REST API
 * 
 * Production-grade PDF parsing using LlamaIndex's LlamaParse.
 * Uses the REST API directly for compatibility with Next.js server components.
 * 
 * Typical processing time: ~5-10 seconds regardless of document size
 */

const LLAMAPARSE_API_URL = 'https://api.cloud.llamaindex.ai/api/v1/parsing'

interface LlamaParseJob {
  id: string
  status: 'PENDING' | 'SUCCESS' | 'ERROR'
}

interface LlamaParseResult {
  text: string
  pages: Array<{ page: number; text: string }>
}

/**
 * Extract text from a PDF buffer using LlamaParse REST API
 */
export async function extractTextWithLlamaParse(buffer: Buffer | ArrayBuffer): Promise<{
  text: string
  pageCount: number
  method: 'llamaparse' | 'failed'
  error?: string
}> {
  const startTime = Date.now()
  console.log('[LlamaParse] Starting PDF extraction via REST API...')
  
  const apiKey = process.env.LLAMA_CLOUD_API_KEY
  if (!apiKey) {
    return {
      text: '',
      pageCount: 0,
      method: 'failed',
      error: 'LLAMA_CLOUD_API_KEY environment variable is required',
    }
  }
  
  try {
    // Convert to ArrayBuffer for Blob compatibility
    let arrayBuffer: ArrayBuffer
    if (buffer instanceof ArrayBuffer) {
      arrayBuffer = buffer
    } else {
      // Create a new ArrayBuffer copy from Buffer
      // Type assertion needed due to Node.js Buffer types
      arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
    }
    
    // Step 1: Upload the file
    const formData = new FormData()
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
    formData.append('file', blob, 'document.pdf')
    
    console.log('[LlamaParse] Uploading PDF...')
    const uploadResponse = await fetch(`${LLAMAPARSE_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    })
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('[LlamaParse] Upload failed:', errorText)
      return {
        text: '',
        pageCount: 0,
        method: 'failed',
        error: `Upload failed: ${uploadResponse.status} - ${errorText}`,
      }
    }
    
    const job: LlamaParseJob = await uploadResponse.json()
    console.log('[LlamaParse] Job created:', job.id)
    
    // Step 2: Poll for completion
    let result: LlamaParseResult | null = null
    let attempts = 0
    const maxAttempts = 60 // 60 seconds max wait
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      attempts++
      
      const statusResponse = await fetch(`${LLAMAPARSE_API_URL}/job/${job.id}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      })
      
      if (!statusResponse.ok) {
        console.error('[LlamaParse] Status check failed')
        continue
      }
      
      const status: LlamaParseJob = await statusResponse.json()
      
      if (status.status === 'SUCCESS') {
        // Get the result
        const resultResponse = await fetch(`${LLAMAPARSE_API_URL}/job/${job.id}/result/text`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        })
        
        if (resultResponse.ok) {
          const text = await resultResponse.text()
          result = { text, pages: [] }
        }
        break
      } else if (status.status === 'ERROR') {
        return {
          text: '',
          pageCount: 0,
          method: 'failed',
          error: 'LlamaParse processing failed',
        }
      }
      
      // Still pending, continue polling
      if (attempts % 5 === 0) {
        console.log(`[LlamaParse] Still processing... (${attempts}s)`)
      }
    }
    
    if (!result) {
      return {
        text: '',
        pageCount: 0,
        method: 'failed',
        error: 'LlamaParse timed out after 60 seconds',
      }
    }
    
    const text = result.text.trim()
    // Estimate page count from text (rough estimate)
    const pageCount = Math.max(1, Math.ceil(text.length / 3000))
    
    console.log(`[LlamaParse] Extraction complete in ${Date.now() - startTime}ms (${pageCount} est. pages, ${text.length} chars)`)
    
    if (text.length > 0) {
      return {
        text,
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
 * Extract text from a PDF URL using LlamaParse REST API
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
