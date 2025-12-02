import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import PDFDocument from 'pdfkit'

export async function GET(_: Request, { params }: any) {
  const docs = await db.document.findMany({ where: { projectId: params.projectId, type: 'materials' } })
  if (!docs.length) return new NextResponse('No materials', { status: 404 })
  const mat = docs[0].content as any

  const doc = new PDFDocument({ size: 'LETTER', margin: 36 })
  const chunks: Buffer[] = []
  doc.on('data', (c: any) => chunks.push(c as Buffer))

  // Title
  doc.fontSize(18).text('Materials List', { align: 'left' })
  doc.moveDown(0.5)

  const items: any[] = mat.items ?? []

  // Table header
  doc.fontSize(10).font('Helvetica-Bold')
  const yHeader = doc.y
  doc.text('Material', 36, yHeader, { width: 200 })
  doc.text('Qty', 240, yHeader, { width: 60 })
  doc.text('Unit', 300, yHeader, { width: 60 })
  doc.text('Specs', 360, yHeader, { width: 200 })
  doc.moveDown(0.7)

  // Rows
  doc.font('Helvetica').fontSize(9)
  items.forEach((it) => {
    const yRow = doc.y
    doc.text(String(it.name ?? ''), 36, yRow, { width: 200 })
    doc.text(String(it.quantity ?? ''), 240, yRow, { width: 60 })
    doc.text(String(it.unit ?? ''), 300, yRow, { width: 60 })
    doc.text(String(it.specs ?? ''), 360, yRow, { width: 200 })
    doc.moveDown(0.5)
  })

  doc.moveDown(1)
  doc.fontSize(10).text(`Total items: ${items.length}`)

  doc.end()

  const buf = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  })

  const src = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  const ab = new ArrayBuffer(src.byteLength)
  new Uint8Array(ab).set(src)
  return new Response(ab, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="materials.pdf"' } })
}
