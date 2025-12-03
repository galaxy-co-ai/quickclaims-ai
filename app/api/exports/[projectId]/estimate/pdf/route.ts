import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import PDFDocument from 'pdfkit'
import { requireAuthUserId } from '@/lib/auth'

const usd = (n?: number) => (n == null ? '' : `$${n.toFixed(2)}`)

export async function GET(_: Request, { params }: any) {
  try {
    const userId = await requireAuthUserId()
    
    // Verify project belongs to user
    const project = await db.project.findFirst({
      where: { id: params.projectId, userId },
    })
    if (!project) return new NextResponse('Not found', { status: 404 })
    
    const docs = await db.document.findMany({ where: { projectId: params.projectId, type: 'estimate' } })
    if (!docs.length) return new NextResponse('No estimate', { status: 404 })
  const est = docs[0].content as any

  const doc = new PDFDocument({ size: 'LETTER', margin: 36 })
  const chunks: Buffer[] = []
  doc.on('data', (c: any) => chunks.push(c as Buffer))

  doc.fontSize(20).font('Helvetica-Bold').text('Project Estimate', { align: 'center' })
  doc.moveDown(1)

  const items: any[] = est.items ?? []

  items.forEach((it: any, idx: number) => {
    // Item header
    doc.fontSize(11).font('Helvetica-Bold').text(`${idx + 1}. ${it.description ?? 'Item'}`, 36)
    doc.fontSize(9).font('Helvetica').fillColor('#666666').text(`Category: ${it.category ?? '-'}`, 36)
    doc.fillColor('#000000')
    doc.moveDown(0.3)

    // Labor breakdown table
    const laborBreakdown: any[] = it.laborBreakdown ?? []
    if (laborBreakdown.length) {
      doc.fontSize(8).font('Helvetica-Bold').text('Labor Breakdown:', 48)
      doc.font('Helvetica').fontSize(8)
      laborBreakdown.forEach((lb: any) => {
        doc.text(`  • ${lb.role}: ${lb.hours}h × ${usd(lb.hourlyRate)} = ${usd(lb.cost)}`, 48)
      })
      doc.moveDown(0.2)
    }

    // Costs summary
    doc.fontSize(9)
    const parts: string[] = []
    if (it.materialsCost != null) parts.push(`Materials: ${usd(it.materialsCost)}`)
    if (it.permitFees != null && it.permitFees > 0) parts.push(`Permits: ${usd(it.permitFees)}`)
    if (parts.length) doc.text(parts.join('  |  '), 48)

    // Line total
    doc.font('Helvetica-Bold').text(`Line Total: ${usd(it.total)}`, 48)
    doc.font('Helvetica').moveDown(0.5)
  })

  // Summary section
  doc.moveDown(0.5)
  doc.moveTo(36, doc.y).lineTo(576, doc.y).stroke()
  doc.moveDown(0.5)
  doc.fontSize(10).font('Helvetica')
  if (est.laborSubtotal != null) doc.text(`Labor Subtotal: ${usd(est.laborSubtotal)}`, { align: 'right' })
  if (est.materialsSubtotal != null) doc.text(`Materials Subtotal: ${usd(est.materialsSubtotal)}`, { align: 'right' })
  doc.text(`Subtotal: ${usd(est.subtotal)}`, { align: 'right' })
  if (est.tax != null) doc.text(`Tax${est.taxRate ? ` (${est.taxRate}%)` : ''}: ${usd(est.tax)}`, { align: 'right' })
  doc.moveDown(0.3)
  doc.fontSize(14).font('Helvetica-Bold').text(`Grand Total: ${usd(est.grandTotal)}`, { align: 'right' })

  doc.end()

  const buf = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
  })

  const src = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  const ab = new ArrayBuffer(src.byteLength)
  new Uint8Array(ab).set(src)
  return new Response(ab, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="estimate.pdf"' } })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    return new NextResponse('Internal server error', { status: 500 })
  }
}
