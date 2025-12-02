import { Index } from '@upstash/vector'
import OpenAI from 'openai'
import crypto from 'crypto'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const vectorIndex = process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN
  ? new Index({ url: process.env.UPSTASH_VECTOR_REST_URL!, token: process.env.UPSTASH_VECTOR_REST_TOKEN! })
  : undefined

function chunkText(text: string, maxChars = 2000) {
  const chunks: string[] = []
  let i = 0
  while (i < text.length) {
    chunks.push(text.slice(i, i + maxChars))
    i += maxChars
  }
  return chunks
}

export async function embed(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  })
  return res.data.map(d => d.embedding)
}

export async function ingestScope(projectId: string, text: string) {
  if (!vectorIndex) return
  const ns = `project:${projectId}`
  const chunks = chunkText(text)
  const vectors = await embed(chunks)
  await vectorIndex.upsert(
    vectors.map((v, i) => ({
      id: crypto.createHash('sha1').update(`${projectId}:${i}`).digest('hex'),
      vector: v,
      metadata: { i, projectId, text: chunks[i] },
      namespace: ns,
    }))
  )
}

export async function searchScope(projectId: string, query: string, k = 8) {
  if (!vectorIndex) return [] as { chunk: string; score: number }[]
  const [qvec] = await embed([query])
  const res = await vectorIndex.query({ vector: qvec, topK: k, includeMetadata: true, filter: `projectId = \"${projectId}\"` })
  return res.map(r => ({ chunk: (r.metadata as any)?.text ?? '', score: r.score }))
}
