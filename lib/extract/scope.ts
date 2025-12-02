export async function extractScopeText(url: string, mimeType: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch file: ${res.status}`)

  if (mimeType === 'application/pdf' || url.endsWith('.pdf')) {
    const buf = Buffer.from(await res.arrayBuffer())
    const mod = await import('pdf-parse')
    const pdf: any = (mod as any).default || (mod as any)
    const data = await pdf(buf)
    return data.text
  }

  // Try reading as text for other types
  const text = await res.text()
  return text
}
