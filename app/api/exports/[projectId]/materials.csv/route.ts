import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

function toCsv(rows: any[], headers: string[]): string {
  const esc = (v: any) => {
    if (v == null) return ''
    const s = String(v)
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"'
    return s
  }
  return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n')
}

export async function GET(_: Request, { params }: any) {
  const docs = await db.document.findMany({ where: { projectId: params.projectId, type: 'materials' } })
  if (!docs.length) return new NextResponse('No materials', { status: 404 })
  const items = (docs[0].content as any)?.items ?? []
  const csv = toCsv(items, ['name','quantity','unit','specs'])
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="materials.csv"' } })
}
