type Roadmap = { phases?: { name: string; durationDays?: number; tasks?: string[] }[]; assumptions?: string[] }
type Materials = { items?: { name: string; quantity?: number; unit?: string; specs?: string }[] }
type Estimate = { currency?: string; items?: { category?: string; description?: string; quantity?: number; unitCost?: number; laborHours?: number; permitFees?: number; total?: number }[]; subtotal?: number; tax?: number; grandTotal?: number }

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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-foreground/70">
            <th className="p-2">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Specs</th>
          </tr>
        </thead>
        <tbody>
          {data.items!.map((it, i) => (
            <tr key={i} className="border-t border-border">
              <td className="p-2 font-medium">{it.name}</td>
              <td className="p-2">{it.quantity ?? ''}</td>
              <td className="p-2">{it.unit ?? ''}</td>
              <td className="p-2">{it.specs ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function EstimateView({ data }: { data: Estimate }) {
  if (!data?.items?.length) return <p className="text-muted-foreground text-sm">No estimate yet.</p>
  const currency = data.currency || 'USD'
  const fmt = (n?: number) => (n == null ? '' : new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n))
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-foreground/70">
              <th className="p-2">Category</th>
              <th className="p-2">Description</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Unit Cost</th>
              <th className="p-2">Labor Hrs</th>
              <th className="p-2">Permit Fees</th>
              <th className="p-2">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items!.map((it, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-2">{it.category}</td>
                <td className="p-2">{it.description}</td>
                <td className="p-2">{it.quantity ?? ''}</td>
                <td className="p-2">{fmt(it.unitCost)}</td>
                <td className="p-2">{it.laborHours ?? ''}</td>
                <td className="p-2">{fmt(it.permitFees)}</td>
                <td className="p-2 font-medium">{fmt(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-right text-sm">
        <div>Subtotal: <span className="font-medium">{fmt(data.subtotal)}</span></div>
        {data.tax != null && <div>Tax: <span className="font-medium">{fmt(data.tax)}</span></div>}
        <div className="text-base">Grand Total: <span className="font-semibold">{fmt(data.grandTotal)}</span></div>
      </div>
    </div>
  )
}
