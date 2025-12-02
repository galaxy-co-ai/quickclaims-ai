type Roadmap = { phases?: { name: string; durationDays?: number; tasks?: string[] }[]; assumptions?: string[] }
type Materials = { 
  items?: { name: string; quantity?: number; unit?: string; specs?: string; unitPrice?: number; totalPrice?: number }[]
  totalMaterialsCost?: number 
}
type LaborBreakdown = { role: string; hours: number; hourlyRate: number; cost: number }
type EstimateItem = {
  category?: string
  description?: string
  quantity?: number
  unitCost?: number
  laborBreakdown?: LaborBreakdown[]
  materialsCost?: number
  permitFees?: number
  total?: number
}
type Estimate = {
  currency?: string
  items?: EstimateItem[]
  laborSubtotal?: number
  materialsSubtotal?: number
  subtotal?: number
  taxRate?: number
  tax?: number
  grandTotal?: number
}

const usd = (n?: number) =>
  n == null ? '' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export function RoadmapView({ data }: { data: Roadmap }) {
  if (!data?.phases?.length) return <p className="text-muted-foreground text-sm">No roadmap yet.</p>
  return (
    <div className="space-y-3">
      {data.phases!.map((p, i) => (
        <div key={i} className="border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{p.name}</h4>
            {p.durationDays != null && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{p.durationDays} days</span>
            )}
          </div>
          {p.tasks?.length ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-foreground/80">
              {p.tasks.map((t, idx) => <li key={idx}>{t}</li>)}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function MaterialsView({ data }: { data: Materials }) {
  if (!data?.items?.length) return <p className="text-muted-foreground text-sm">No materials yet.</p>
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-foreground/70">
              <th className="p-2">Item</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Specs</th>
              <th className="p-2 text-right">Unit Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items!.map((it, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-2 font-medium">{it.name}</td>
                <td className="p-2">{it.quantity ?? ''}</td>
                <td className="p-2">{it.unit ?? ''}</td>
                <td className="p-2">{it.specs ?? ''}</td>
                <td className="p-2 text-right">{usd(it.unitPrice)}</td>
                <td className="p-2 text-right font-medium">{usd(it.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.totalMaterialsCost != null && (
        <div className="text-right text-sm">
          <span className="font-medium">Total Materials: {usd(data.totalMaterialsCost)}</span>
        </div>
      )}
    </div>
  )
}

export function EstimateView({ data }: { data: Estimate }) {
  if (!data?.items?.length) return <p className="text-muted-foreground text-sm">No estimate yet.</p>
  return (
    <div className="space-y-4">
      {data.items!.map((it, i) => (
        <div key={i} className="border border-border rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase text-foreground/60">{it.category}</span>
              <h5 className="font-medium">{it.description}</h5>
            </div>
            <span className="font-semibold">{usd(it.total)}</span>
          </div>
          {/* Labor breakdown */}
          {it.laborBreakdown?.length ? (
            <div className="text-sm bg-muted/30 rounded-lg p-3">
              <p className="text-xs font-semibold text-foreground/70 mb-1">Labor Breakdown</p>
              <div className="space-y-1">
                {it.laborBreakdown.map((lb, idx) => (
                  <div key={idx} className="flex items-center justify-between text-foreground/80">
                    <span>{lb.role}</span>
                    <span>{lb.hours}h × {usd(lb.hourlyRate)} = {usd(lb.cost)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-4 text-xs text-foreground/70">
            {it.materialsCost != null && <span>Materials: {usd(it.materialsCost)}</span>}
            {it.permitFees != null && it.permitFees > 0 && <span>Permits: {usd(it.permitFees)}</span>}
            {it.quantity != null && it.unitCost != null && <span>Qty {it.quantity} × {usd(it.unitCost)}</span>}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="text-right text-sm space-y-1 pt-2 border-t border-border">
        {data.laborSubtotal != null && <div>Labor: <span className="font-medium">{usd(data.laborSubtotal)}</span></div>}
        {data.materialsSubtotal != null && <div>Materials: <span className="font-medium">{usd(data.materialsSubtotal)}</span></div>}
        <div>Subtotal: <span className="font-medium">{usd(data.subtotal)}</span></div>
        {data.tax != null && (
          <div>Tax{data.taxRate ? ` (${data.taxRate}%)` : ''}: <span className="font-medium">{usd(data.tax)}</span></div>
        )}
        <div className="text-base pt-1">Grand Total: <span className="font-bold">{usd(data.grandTotal)}</span></div>
      </div>
    </div>
  )
}
