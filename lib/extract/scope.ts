export async function extractScopeText(url: string, mimeType: string): Promise<string> {
  // Step 1: Fetch the file
  let res: Response
  try {
    res = await fetch(url)
  } catch (fetchError) {
    throw new Error(`Could not download file. Please try re-uploading.`)
  }
  
  if (!res.ok) {
    throw new Error(`Failed to fetch file (HTTP ${res.status}). Please try re-uploading.`)
  }

  // Step 2: Parse PDF if applicable
  if (mimeType === 'application/pdf' || url.endsWith('.pdf')) {
    const buf = Buffer.from(await res.arrayBuffer())
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mod: any = await import('pdf-parse')
      const pdf = mod.default || mod
      const data = await pdf(buf)
      return data.text
    } catch (parseError) {
      const errorMsg = parseError instanceof Error ? parseError.message : 'unknown'
      throw new Error(`Could not read PDF content. The file may be corrupted, encrypted, or unsupported. (${errorMsg})`)
    }
  }

  // Try reading as text for other types
  const text = await res.text()
  return text
}
