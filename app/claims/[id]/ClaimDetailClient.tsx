'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClaimSummaryCard, LineItemsTable, ScopeUploader } from '@/components/claims'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ClaimDetailClientProps {
  claim: {
    id: string
    claimNumber: string | null
    carrier: string | null
    status: string
    dateOfLoss: string | null
    deductible: number | null
    adjusterName: string | null
    adjusterEmail: string | null
    adjusterPhone: string | null
    policyType: string | null
  }
  project: {
    id: string
    clientName: string
    address: string
  }
  summary: {
    latestVersion: number
    totalRCV: number
    totalACV: number
    totalDepreciation: number
    deductible: number
    netPayment: number
    totalSquares: number | null
    dollarPerSquare: number | null
    lineItemCount: number
  } | null
  lineItems: Array<{
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
  }>
  activities: Array<{
    id: string
    action: string
    description: string | null
    createdAt: string
  }>
  scopeCount: number
}

export function ClaimDetailClient({
  claim,
  project,
  summary,
  lineItems,
  activities,
  scopeCount,
}: ClaimDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'scope' | 'activity'>('scope')

  const handleScopeParsed = () => {
    // Refresh the page to show new data
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <ClaimSummaryCard
        claim={claim}
        summary={summary}
        project={project}
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('scope')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'scope'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Carrier Scope {scopeCount > 0 && `(v${scopeCount})`}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'activity'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Activity ({activities.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'scope' && (
        <div className="space-y-6">
          {/* Upload New Scope or Show Line Items */}
          {lineItems.length === 0 ? (
            <ScopeUploader
              claimId={claim.id}
              projectId={project.id}
              onScopeParsed={handleScopeParsed}
            />
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium">
                    Statement of Loss v{summary?.latestVersion || 1}
                  </h3>
                  {summary?.dollarPerSquare && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      ${summary.dollarPerSquare.toFixed(0)}/SQ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Export functionality
                    }}
                  >
                    Export CSV
                  </Button>
                  <ScopeUploaderMini
                    claimId={claim.id}
                    projectId={project.id}
                    onScopeParsed={handleScopeParsed}
                  />
                </div>
              </div>

              {/* Missing Items Alert */}
              <MissingItemsAlert lineItems={lineItems} />

              {/* Line Items Table */}
              <LineItemsTable lineItems={lineItems} />
            </>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Claim Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description || activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Mini uploader for adding new scope versions
function ScopeUploaderMini({
  claimId,
  projectId,
  onScopeParsed,
}: {
  claimId: string
  projectId: string
  onScopeParsed: () => void
}) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', projectId)
      formData.append('fileType', 'scope')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error('Upload failed')

      const { upload } = await uploadResponse.json()

      // Parse scope
      const parseResponse = await fetch(`/api/claims/${claimId}/parse-scope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: upload.id }),
      })

      if (!parseResponse.ok) throw new Error('Parse failed')

      onScopeParsed()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <label className="cursor-pointer">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      <span className="inline-flex items-center justify-center h-9 px-3 text-sm rounded-lg font-medium border border-border bg-transparent hover:bg-muted/50 text-foreground transition-all cursor-pointer">
        {isUploading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </>
        ) : 'Upload New SOL'}
      </span>
    </label>
  )
}

// Alert showing potentially missing items
function MissingItemsAlert({
  lineItems,
}: {
  lineItems: Array<{ xactimateCode: string | null; description: string }>
}) {
  const descriptions = lineItems.map(i => i.description.toLowerCase())
  const codes = lineItems.map(i => i.xactimateCode?.toUpperCase()).filter(Boolean)

  const missing: Array<{ name: string; code: string }> = []

  // Check common missing items
  if (!codes.includes('RFGDRIP') && !descriptions.some(d => d.includes('drip edge'))) {
    missing.push({ name: 'Drip Edge', code: 'R905.2.8.5' })
  }
  if (!codes.includes('RFGSTRT') && !descriptions.some(d => d.includes('starter'))) {
    missing.push({ name: 'Starter Course', code: 'R904.1' })
  }
  if (!codes.some(c => c?.startsWith('RFGRIDG')) && !descriptions.some(d => d.includes('ridge') || d.includes('hip'))) {
    missing.push({ name: 'Hip/Ridge Cap', code: '' })
  }

  if (missing.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h4 className="font-medium text-amber-800">Potentially Missing Items</h4>
          <p className="text-sm text-amber-700 mt-1">
            The following items may be missing from the carrier scope:
          </p>
          <ul className="mt-2 space-y-1">
            {missing.map((item) => (
              <li key={item.name} className="text-sm text-amber-700 flex items-center gap-2">
                <span>•</span>
                <span className="font-medium">{item.name}</span>
                {item.code && (
                  <span className="text-xs bg-amber-200/50 px-1.5 py-0.5 rounded">
                    {item.code}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
