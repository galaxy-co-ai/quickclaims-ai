'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { getXactimateCode } from '@/lib/claims/xactimate-codes'

interface LineItem {
  id: string
  lineNumber: number | null
  xactimateCode: string | null
  description: string
  category: string
  area: string | null
  quantity: number
  unit: string
  unitPrice: number
  rcv: number
  depreciation: number
  acv: number
  ageLife: string | null
  isSupplemented: boolean
}

interface LineItemsTableProps {
  lineItems: LineItem[]
  onItemClick?: (item: LineItem) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const CATEGORY_COLORS: Record<string, string> = {
  roofing: 'bg-blue-100 text-blue-800',
  gutters: 'bg-cyan-100 text-cyan-800',
  painting: 'bg-purple-100 text-purple-800',
  siding: 'bg-orange-100 text-orange-800',
  drywall: 'bg-yellow-100 text-yellow-800',
  carpet: 'bg-pink-100 text-pink-800',
  interior: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800',
}

export function LineItemsTable({ lineItems, onItemClick }: LineItemsTableProps) {
  const [groupBy, setGroupBy] = useState<'category' | 'area' | 'none'>('category')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return lineItems
    const q = searchQuery.toLowerCase()
    return lineItems.filter(
      item =>
        item.description.toLowerCase().includes(q) ||
        item.xactimateCode?.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [lineItems, searchQuery])

  // Group items
  const groupedItems = useMemo(() => {
    if (groupBy === 'none') return { 'All Items': filteredItems }
    
    return filteredItems.reduce((acc, item) => {
      const key = groupBy === 'category' 
        ? item.category 
        : (item.area || 'Unspecified')
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {} as Record<string, LineItem[]>)
  }, [filteredItems, groupBy])

  // Calculate totals
  const totals = useMemo(() => {
    return filteredItems.reduce(
      (acc, item) => ({
        rcv: acc.rcv + item.rcv,
        depreciation: acc.depreciation + item.depreciation,
        acv: acc.acv + item.acv,
      }),
      { rcv: 0, depreciation: 0, acv: 0 }
    )
  }, [filteredItems])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Line Items ({lineItems.length})</CardTitle>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            
            {/* Group By */}
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as typeof groupBy)}
              className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="category">Group by Category</option>
              <option value="area">Group by Area</option>
              <option value="none">No Grouping</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="mb-6 last:mb-0">
              {groupBy !== 'none' && (
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                  <h4 className="font-medium text-sm capitalize flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${CATEGORY_COLORS[group] || CATEGORY_COLORS.other}`}>
                      {group}
                    </span>
                    <span className="text-muted-foreground">({items.length} items)</span>
                  </h4>
                  <span className="text-sm font-medium">
                    {formatCurrency(items.reduce((sum, i) => sum + i.rcv, 0))} RCV
                  </span>
                </div>
              )}

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="pb-2 pr-2 font-medium">#</th>
                    <th className="pb-2 pr-2 font-medium">Code</th>
                    <th className="pb-2 pr-4 font-medium">Description</th>
                    <th className="pb-2 pr-2 font-medium text-right">Qty</th>
                    <th className="pb-2 pr-2 font-medium">Unit</th>
                    <th className="pb-2 pr-2 font-medium text-right">Unit $</th>
                    <th className="pb-2 pr-2 font-medium text-right">RCV</th>
                    <th className="pb-2 pr-2 font-medium text-right">Depr</th>
                    <th className="pb-2 font-medium text-right">ACV</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const codeInfo = item.xactimateCode 
                      ? getXactimateCode(item.xactimateCode) 
                      : undefined
                    
                    return (
                      <tr
                        key={item.id}
                        onClick={() => onItemClick?.(item)}
                        className={`
                          border-b border-border/50 last:border-0
                          ${onItemClick ? 'cursor-pointer hover:bg-muted/30' : ''}
                          ${item.isSupplemented ? 'bg-green-50' : ''}
                        `}
                      >
                        <td className="py-2 pr-2 text-muted-foreground">
                          {item.lineNumber}
                        </td>
                        <td className="py-2 pr-2">
                          {item.xactimateCode ? (
                            <span 
                              className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted"
                              title={codeInfo?.description}
                            >
                              {item.xactimateCode}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          <div className="max-w-xs">
                            <p className={item.isSupplemented ? 'font-semibold' : ''}>
                              {item.description}
                            </p>
                            {item.area && groupBy !== 'area' && (
                              <p className="text-xs text-muted-foreground">{item.area}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-2 pr-2 text-right font-mono">
                          {item.quantity.toFixed(2)}
                        </td>
                        <td className="py-2 pr-2 text-muted-foreground">
                          {item.unit}
                        </td>
                        <td className="py-2 pr-2 text-right font-mono">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-2 pr-2 text-right font-mono font-medium">
                          {formatCurrency(item.rcv)}
                        </td>
                        <td className="py-2 pr-2 text-right font-mono text-orange-600">
                          {item.depreciation > 0 ? `-${formatCurrency(item.depreciation)}` : '—'}
                        </td>
                        <td className="py-2 text-right font-mono">
                          {formatCurrency(item.acv)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex justify-end gap-8 text-sm">
            <div className="text-right">
              <p className="text-muted-foreground">Total RCV</p>
              <p className="font-semibold text-lg">{formatCurrency(totals.rcv)}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total Depreciation</p>
              <p className="font-semibold text-lg text-orange-600">
                -{formatCurrency(totals.depreciation)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Total ACV</p>
              <p className="font-semibold text-lg">{formatCurrency(totals.acv)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
