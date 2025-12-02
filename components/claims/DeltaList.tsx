'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface DeltaItem {
  id: string
  deltaType: string
  status: string
  xactimateCode: string | null
  description: string
  category: string | null
  ircCode: string | null
  defenseNote: string | null
  quantity: number | null
  unit: string | null
  estimatedRCV: number | null
  evidenceNotes: string | null
  photoAnalysis?: {
    id: string
    photoType: string
    location: string | null
  } | null
}

interface DeltaListProps {
  deltas: DeltaItem[]
  onStatusChange?: (deltaId: string, newStatus: string) => void
  showActions?: boolean
}

const DELTA_TYPE_INFO: Record<string, { label: string; color: string; icon: string }> = {
  missing: { 
    label: 'Missing Item', 
    color: 'red',
    icon: '⚠️'
  },
  underscoped: { 
    label: 'Underscoped', 
    color: 'orange',
    icon: '📉'
  },
  incorrect_code: { 
    label: 'Incorrect Code', 
    color: 'yellow',
    icon: '🔄'
  },
  incorrect_qty: { 
    label: 'Quantity Issue', 
    color: 'amber',
    icon: '📊'
  },
  recommend_add: { 
    label: 'Recommended', 
    color: 'blue',
    icon: '➕'
  },
}

const STATUS_INFO: Record<string, { label: string; color: string }> = {
  identified: { label: 'To Review', color: 'gray' },
  approved: { label: 'Approved', color: 'green' },
  denied: { label: 'Denied', color: 'red' },
  included: { label: 'In Supplement', color: 'blue' },
}

export function DeltaList({ deltas, onStatusChange, showActions = true }: DeltaListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Group by type
  const groupedDeltas = deltas.reduce((acc, delta) => {
    if (!acc[delta.deltaType]) {
      acc[delta.deltaType] = []
    }
    acc[delta.deltaType].push(delta)
    return acc
  }, {} as Record<string, DeltaItem[]>)

  // Sort types by priority (missing first)
  const typeOrder = ['missing', 'underscoped', 'incorrect_code', 'incorrect_qty', 'recommend_add']
  const sortedTypes = Object.keys(groupedDeltas).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  )

  if (deltas.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-medium text-lg mb-2">No Deltas Found</h3>
          <p className="text-muted-foreground">
            The carrier scope appears complete, or run delta analysis to check for missing items.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Deltas</p>
          <p className="text-2xl font-bold">{deltas.length}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs text-red-600 uppercase tracking-wide">Missing Items</p>
          <p className="text-2xl font-bold text-red-600">
            {deltas.filter(d => d.deltaType === 'missing').length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs text-blue-600 uppercase tracking-wide">Recommended</p>
          <p className="text-2xl font-bold text-blue-600">
            {deltas.filter(d => d.deltaType === 'recommend_add').length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-green-600 uppercase tracking-wide">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {deltas.filter(d => d.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Delta Items by Type */}
      {sortedTypes.map((type) => {
        const typeInfo = DELTA_TYPE_INFO[type] || { label: type, color: 'gray', icon: '•' }
        const items = groupedDeltas[type]

        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span>{typeInfo.icon}</span>
                <span>{typeInfo.label}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  ({items.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((delta) => {
                  const statusInfo = STATUS_INFO[delta.status] || { label: delta.status, color: 'gray' }
                  const isExpanded = expandedId === delta.id

                  return (
                    <div
                      key={delta.id}
                      className="border border-border rounded-xl overflow-hidden"
                    >
                      {/* Header */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedId(isExpanded ? null : delta.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {delta.xactimateCode && (
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {delta.xactimateCode}
                            </code>
                          )}
                          <span className="font-medium truncate">{delta.description}</span>
                          {delta.ircCode && (
                            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                              IRC {delta.ircCode}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}
                            style={{
                              backgroundColor: `var(--${statusInfo.color}-100, #f3f4f6)`,
                              color: `var(--${statusInfo.color}-700, #374151)`,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                          <svg
                            className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-border p-4 bg-muted/20 space-y-4">
                          {/* Defense Note */}
                          {delta.defenseNote && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Defense Note
                              </h4>
                              <p className="text-sm">{delta.defenseNote}</p>
                            </div>
                          )}

                          {/* Evidence */}
                          {delta.evidenceNotes && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Photo Evidence
                              </h4>
                              <p className="text-sm">{delta.evidenceNotes}</p>
                              {delta.photoAnalysis && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Source: {delta.photoAnalysis.photoType} photo
                                  {delta.photoAnalysis.location && ` - ${delta.photoAnalysis.location}`}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Quantity/Cost Info */}
                          {(delta.quantity || delta.estimatedRCV) && (
                            <div className="flex gap-6">
                              {delta.quantity && (
                                <div>
                                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                    Quantity
                                  </h4>
                                  <p className="text-sm font-medium">
                                    {delta.quantity} {delta.unit}
                                  </p>
                                </div>
                              )}
                              {delta.estimatedRCV && (
                                <div>
                                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                    Est. RCV
                                  </h4>
                                  <p className="text-sm font-medium">
                                    ${delta.estimatedRCV.toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          {showActions && onStatusChange && delta.status === 'identified' && (
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onStatusChange(delta.id, 'approved')
                                }}
                              >
                                ✓ Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onStatusChange(delta.id, 'denied')
                                }}
                              >
                                ✕ Deny
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
