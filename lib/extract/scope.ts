import { extractTextFromPdfUrl } from '@/lib/pdf/extract'

export async function extractScopeText(url: string, mimeType: string): Promise<string> {
  // Parse PDF if applicable - use robust multi-method extraction
  if (mimeType === 'application/pdf' || url.endsWith('.pdf')) {
    const extraction = await extractTextFromPdfUrl(url)
    
    if (extraction.method === 'failed' || !extraction.text) {
      throw new Error(extraction.error || 'Could not extract text from PDF. The file may be corrupted or unsupported.')
    }
    
    return extraction.text
  }

  // For non-PDF files, fetch and read as text
  let res: Response
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Could not download file. Please try re-uploading.')
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch file (HTTP ${res.status}). Please try re-uploading.`)
  }

  const text = await res.text()
  return text
}
