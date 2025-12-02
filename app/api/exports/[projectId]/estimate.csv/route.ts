import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const esc = (v: any) => {
  if (v == null) return ''
  const s = String(v)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

const fmtUsd = (n?: number) => (n == null ? '' : `$${n.toFixed(2)}`)

export async function GET(_: Request, { params }: any) {
  const docs = await db.document.findMany({ where: { projectId: params.projectId, type: 'estimate' } })
  if (!docs.length) return new NextResponse('No estimate', { status: 404 })
  const est = docs[0].content as any
  const items: any[] = est?.items ?? []

  // Flatten labor breakdown into individual rows
  const rows: string[] = []
  const header = 'Category,Description,Qty,Unit Cost,Labor Role,Labor Hours,Hourly Rate,Labor Cost,Materials Cost,Permit Fees,Line Total'
  rows.push(header)

  for (const it of items) {
    const laborBreakdown: any[] = it.laborBreakdown ?? []
    if (laborBreakdown.length === 0) {
      // Single row without labor breakdown
      rows.push([
        esc(it.category), esc(it.description), esc(it.quantity), fmtUsd(it.unitCost),
        '', '', '', '',
        fmtUsd(it.materialsCost), fmtUsd(it.permitFees), fmtUsd(it.total)
      ].join(','))
    } else {
      // First row with item info + first labor role
      const first = laborBreakdown[0]
      rows.push([
        esc(it.category), esc(it.description), esc(it.quantity), fmtUsd(it.unitCost),
        esc(first.role), esc(first.hours), fmtUsd(first.hourlyRate), fmtUsd(first.cost),
        fmtUsd(it.materialsCost), fmtUsd(it.permitFees), fmtUsd(it.total)
      ].join(','))
      // Subsequent rows for additional labor roles
      for (let i = 1; i < laborBreakdown.length; i++) {
        const lb = laborBreakdown[i]
        rows.push([
          '', '', '', '',
          esc(lb.role), esc(lb.hours), fmtUsd(lb.hourlyRate), fmtUsd(lb.cost),
          '', '', ''
        ].join(','))
      }
    }
  }

  // Totals
  rows.push('')
  if (est.laborSubtotal != null) rows.push(`Labor Subtotal,,,,,,,,,${fmtUsd(est.laborSubtotal)},`)
  if (est.materialsSubtotal != null) rows.push(`Materials Subtotal,,,,,,,,${fmtUsd(est.materialsSubtotal)},,`)
  rows.push(`Subtotal,,,,,,,,,,${fmtUsd(est.subtotal)}`)
  if (est.tax != null) rows.push(`Tax${est.taxRate ? ` (${est.taxRate}%)` : ''},,,,,,,,,,${fmtUsd(est.tax)}`)
  rows.push(`Grand Total,,,,,,,,,,${fmtUsd(est.grandTotal)}`)

  const csv = rows.join('\n')
  return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="estimate.csv"' } })
}
