import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import PDFDocument from 'pdfkit'

export async function GET(_: Request, { params }: any) {
  const docs = await db.document.findMany({ where: { projectId: params.projectId, type: 'estimate' } })
  if (!docs.length) return new NextResponse('No estimate', { status: 404 })
  const est = docs[0].content as any

  const doc = new PDFDocument({ size: 'LETTER', margin: 36 })
  const chunks: Buffer[] = []
  doc.on('data', (c: any) => chunks.push(c as Buffer))

  doc.fontSize(18).text('Estimate', { align: 'left' })
  doc.moveDown(0.5)

  const items = est.items ?? []
  doc.fontSize(10)
  doc.text('Category', 36, doc.y)
  doc.text('Description', 120, doc.y)
  doc.text('Qty', 360, doc.y)
  doc.text('Unit Cost', 400, doc.y)
  doc.text('Labor Hrs', 470, doc.y)
  doc.text('Permit', 530, doc.y)
  doc.text('Total', 580, doc.y)
  doc.moveDown(0.5)

  items.forEach((it: any) => {
    doc.text(it.category ?? '', 36, doc.y)
    doc.text(String(it.description ?? ''), 120, doc.y, { width: 230 })
    doc.text(String(it.quantity ?? ''), 360, doc.y)
    doc.text(String(it.unitCost ?? ''), 400, doc.y)
    doc.text(String(it.laborHours ?? ''), 470, doc.y)
    doc.text(String(it.permitFees ?? ''), 530, doc.y)
    doc.text(String(it.total ?? ''), 580, doc.y)
    doc.moveDown(0.5)
  })

  doc.moveDown(1)
  doc.fontSize(12)
  if (est.subtotal != null) doc.text(`Subtotal: ${est.subtotal}`)
  if (est.tax != null) doc.text(`Tax: ${est.tax}`)
  if (est.grandTotal != null) doc.text(`Grand Total: ${est.grandTotal}`)

  doc.end()

  const buf = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  })

  const src = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  const ab = new ArrayBuffer(src.byteLength)
  new Uint8Array(ab).set(src)
  return new Response(ab, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="estimate.pdf"' } })
}
