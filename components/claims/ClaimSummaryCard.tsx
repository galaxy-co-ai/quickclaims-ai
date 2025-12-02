'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { CLAIM_STATUS_INFO, type ClaimStatus } from '@/lib/claims/schemas'

interface ClaimSummaryCardProps {
  claim: {
    id: string
    claimNumber: string | null
    carrier: string | null
    status: string
    dateOfLoss: string | null
    deductible: number | null
  }
  summary: {
    totalRCV: number
    totalACV: number
    totalDepreciation: number
    deductible: number
    netPayment: number
    totalSquares: number | null
    dollarPerSquare: number | null
    lineItemCount: number
  } | null
  project: {
    clientName: string
    address: string
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ClaimSummaryCard({ claim, summary, project }: ClaimSummaryCardProps) {
  const statusInfo = CLAIM_STATUS_INFO[claim.status as ClaimStatus] || {
    label: claim.status,
    color: 'gray',
    description: '',
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              {project.clientName}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
                style={{
                  backgroundColor: `var(--${statusInfo.color}-100, #f3f4f6)`,
                  color: `var(--${statusInfo.color}-800, #1f2937)`,
                }}
              >
                {statusInfo.label}
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{project.address}</p>
          </div>
          {claim.claimNumber && (
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground">Claim #</p>
              <p className="text-sm font-mono">{claim.claimNumber}</p>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Key Metrics Grid */}
        {summary ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* D$/SQ - The Key KPI */}
            <div className="bg-primary/10 rounded-xl p-4 col-span-2 md:col-span-1">
              <p className="text-xs font-medium text-primary uppercase tracking-wide">D$/SQ</p>
              <p className="text-2xl font-bold text-primary">
                {summary.dollarPerSquare 
                  ? `$${summary.dollarPerSquare.toFixed(0)}`
                  : 'N/A'
                }
              </p>
              {summary.totalSquares && (
                <p className="text-xs text-muted-foreground">
                  {summary.totalSquares.toFixed(1)} squares
                </p>
              )}
            </div>

            {/* Total RCV */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">RCV</p>
              <p className="text-xl font-semibold">{formatCurrency(summary.totalRCV)}</p>
              <p className="text-xs text-muted-foreground">
                {summary.lineItemCount} line items
              </p>
            </div>

            {/* Depreciation */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Depreciation</p>
              <p className="text-xl font-semibold text-orange-600">
                -{formatCurrency(summary.totalDepreciation)}
              </p>
              <p className="text-xs text-muted-foreground">
                {summary.totalRCV > 0 
                  ? `${((summary.totalDepreciation / summary.totalRCV) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>

            {/* Net Payment */}
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Net Payment</p>
              <p className="text-xl font-semibold text-green-700">
                {formatCurrency(summary.netPayment)}
              </p>
              <p className="text-xs text-green-600">
                After ${summary.deductible.toLocaleString()} deductible
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-xl p-6 text-center mb-6">
            <p className="text-muted-foreground">No carrier scope uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a carrier scope PDF to see claim metrics
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 mb-6">
          <Link
            href={`/claims/${claim.id}/checklist`}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Build Day Checklist
          </Link>
        </div>

        {/* Claim Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Carrier</p>
            <p className="font-medium">{claim.carrier || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date of Loss</p>
            <p className="font-medium">{formatDate(claim.dateOfLoss)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Deductible</p>
            <p className="font-medium">
              {claim.deductible ? formatCurrency(claim.deductible) : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{statusInfo.description || statusInfo.label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
