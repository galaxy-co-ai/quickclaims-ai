'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ClaimData {
  id: string
  claimNumber: string | null
  status: string
  carrier: string | null
  createdAt: Date
  project: {
    clientName: string
    address: string
  }
  carrierScopes: Array<{
    totalRCV: number
    dollarPerSquare: number | null
    totalSquares: number | null
  }>
  deltas: Array<{
    status: string
    estimatedRCV: number | null
  }>
  activities: Array<{
    action: string
    createdAt: Date
  }>
}

interface Metrics {
  totalClaims: number
  claimsWithScope: number
  claimsWithSupplements: number
  totalRCV: number
  totalSupplementRCV: number
  avgDPS: number
  minDPS: number
  maxDPS: number
  statusCounts: Record<string, number>
  carrierStats: Array<{
    carrier: string
    count: number
    totalRCV: number
    avgDPS: number
  }>
  monthlyTrend: Array<{
    month: string
    claims: number
    rcv: number
    avgDPS: number
  }>
}

interface AnalyticsDashboardProps {
  claims: ClaimData[]
  metrics: Metrics
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  intake: { label: 'Intake', color: 'bg-gray-100 text-gray-800' },
  scope_review: { label: 'Scope Review', color: 'bg-blue-100 text-blue-800' },
  delta_analysis: { label: 'Delta Analysis', color: 'bg-purple-100 text-purple-800' },
  supplement_pending: { label: 'Supplement Pending', color: 'bg-yellow-100 text-yellow-800' },
  awaiting_sol: { label: 'Awaiting SOL', color: 'bg-orange-100 text-orange-800' },
  rebuttal: { label: 'Rebuttal', color: 'bg-red-100 text-red-800' },
  build_scheduled: { label: 'Build Scheduled', color: 'bg-indigo-100 text-indigo-800' },
  post_build: { label: 'Post Build', color: 'bg-teal-100 text-teal-800' },
  invoicing: { label: 'Invoicing', color: 'bg-emerald-100 text-emerald-800' },
  depreciation_pending: { label: 'Dep. Pending', color: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
}

export function AnalyticsDashboard({ claims, metrics }: AnalyticsDashboardProps) {
  const [view, setView] = useState<'overview' | 'pipeline' | 'carriers'>('overview')

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setView('overview')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            view === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('pipeline')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            view === 'pipeline'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Pipeline
        </button>
        <button
          onClick={() => setView('carriers')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            view === 'carriers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          By Carrier
        </button>
      </div>

      {view === 'overview' && (
        <OverviewView metrics={metrics} claims={claims} />
      )}
      
      {view === 'pipeline' && (
        <PipelineView metrics={metrics} claims={claims} />
      )}
      
      {view === 'carriers' && (
        <CarrierView metrics={metrics} />
      )}
    </div>
  )
}

function OverviewView({ metrics, claims }: { metrics: Metrics; claims: ClaimData[] }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Claims</p>
            <p className="text-3xl font-bold">{metrics.totalClaims}</p>
            <p className="text-xs text-muted-foreground">
              {metrics.claimsWithScope} with scope
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total RCV</p>
            <p className="text-3xl font-bold">${(metrics.totalRCV / 1000).toFixed(0)}K</p>
            <p className="text-xs text-green-600">
              +${(metrics.totalSupplementRCV / 1000).toFixed(1)}K supplements
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg D$/SQ</p>
            <p className="text-3xl font-bold text-primary">${metrics.avgDPS.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">
              Range: ${metrics.minDPS.toFixed(0)} - ${metrics.maxDPS.toFixed(0)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Supplement Rate</p>
            <p className="text-3xl font-bold">
              {metrics.totalClaims > 0 
                ? Math.round((metrics.claimsWithSupplements / metrics.totalClaims) * 100) 
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">
              {metrics.claimsWithSupplements} of {metrics.totalClaims} claims
            </p>
          </CardContent>
        </Card>
      </div>

      {/* D$/SQ Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>D$/SQ Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <DPSChart claims={claims} />
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      {metrics.monthlyTrend.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.monthlyTrend.map((month) => (
                <div key={month.month} className="flex items-center gap-4">
                  <span className="w-20 text-sm text-muted-foreground">
                    {formatMonth(month.month)}
                  </span>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ 
                        width: `${Math.min(100, (month.rcv / Math.max(...metrics.monthlyTrend.map(m => m.rcv))) * 100)}%` 
                      }}
                    />
                  </div>
                  <span className="w-24 text-sm text-right">
                    ${(month.rcv / 1000).toFixed(0)}K
                  </span>
                  <span className="w-16 text-sm text-right text-muted-foreground">
                    {month.claims} claims
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claims.slice(0, 5).map((claim) => (
              <Link
                key={claim.id}
                href={`/claims/${claim.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{claim.project.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {claim.claimNumber || 'No claim #'} • {claim.carrier || 'Unknown carrier'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    STATUS_LABELS[claim.status]?.color || 'bg-gray-100'
                  }`}>
                    {STATUS_LABELS[claim.status]?.label || claim.status}
                  </span>
                  {claim.carrierScopes[0]?.dollarPerSquare && (
                    <p className="text-sm font-medium mt-1">
                      ${claim.carrierScopes[0].dollarPerSquare.toFixed(0)}/SQ
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PipelineView({ metrics, claims }: { metrics: Metrics; claims: ClaimData[] }) {
  const stages = [
    'intake',
    'scope_review',
    'delta_analysis',
    'supplement_pending',
    'awaiting_sol',
    'rebuttal',
    'build_scheduled',
    'post_build',
    'invoicing',
    'depreciation_pending',
    'completed',
  ]
  
  const totalActive = Object.entries(metrics.statusCounts)
    .filter(([status]) => status !== 'completed')
    .reduce((sum, [, count]) => sum + count, 0)

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Active Claims</p>
            <p className="text-3xl font-bold">{totalActive}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Completed</p>
            <p className="text-3xl font-bold text-green-600">{metrics.statusCounts['completed'] || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase">Needing Action</p>
            <p className="text-3xl font-bold text-amber-600">
              {(metrics.statusCounts['supplement_pending'] || 0) + 
               (metrics.statusCounts['awaiting_sol'] || 0) +
               (metrics.statusCounts['rebuttal'] || 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Claim Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stages.map((stage) => {
              const count = metrics.statusCounts[stage] || 0
              const percentage = metrics.totalClaims > 0 
                ? (count / metrics.totalClaims) * 100 
                : 0
              const stageInfo = STATUS_LABELS[stage]
              
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className={`w-32 text-sm px-2 py-1 rounded ${stageInfo?.color || 'bg-gray-100'}`}>
                    {stageInfo?.label || stage}
                  </span>
                  <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={`h-full rounded-lg transition-all ${
                        stage === 'completed' ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                  <span className="w-12 text-sm text-right font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Claims by Stage */}
      {stages.filter(s => metrics.statusCounts[s] > 0).map((stage) => {
        const stageClaims = claims.filter(c => c.status === stage)
        if (stageClaims.length === 0) return null
        
        return (
          <Card key={stage}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${STATUS_LABELS[stage]?.color}`}>
                  {STATUS_LABELS[stage]?.label || stage}
                </span>
                <span className="text-muted-foreground">({stageClaims.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {stageClaims.slice(0, 5).map((claim) => (
                  <Link
                    key={claim.id}
                    href={`/claims/${claim.id}`}
                    className="flex items-center justify-between py-2 hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{claim.project.clientName}</p>
                      <p className="text-xs text-muted-foreground">{claim.carrier}</p>
                    </div>
                    <div className="text-right text-sm">
                      {claim.carrierScopes[0]?.totalRCV 
                        ? `$${(claim.carrierScopes[0].totalRCV / 1000).toFixed(1)}K` 
                        : '—'}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function CarrierView({ metrics }: { metrics: Metrics }) {
  return (
    <div className="space-y-6">
      {/* Carrier Stats */}
      <div className="grid gap-4">
        {metrics.carrierStats.map((carrier) => (
          <Card key={carrier.carrier}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{carrier.carrier}</h3>
                  <p className="text-sm text-muted-foreground">
                    {carrier.count} claim{carrier.count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${(carrier.totalRCV / 1000).toFixed(0)}K
                  </p>
                  {carrier.avgDPS > 0 && (
                    <p className={`text-sm font-medium ${
                      carrier.avgDPS < 300 ? 'text-red-600' : 
                      carrier.avgDPS > 400 ? 'text-green-600' : 
                      'text-amber-600'
                    }`}>
                      ${carrier.avgDPS.toFixed(0)}/SQ avg
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ 
                    width: `${Math.min(100, (carrier.totalRCV / Math.max(...metrics.carrierStats.map(c => c.totalRCV))) * 100)}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        {metrics.carrierStats.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No carrier data available yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function DPSChart({ claims }: { claims: ClaimData[] }) {
  const dpsRanges = [
    { min: 0, max: 250, label: '<$250' },
    { min: 250, max: 300, label: '$250-300' },
    { min: 300, max: 350, label: '$300-350' },
    { min: 350, max: 400, label: '$350-400' },
    { min: 400, max: 450, label: '$400-450' },
    { min: 450, max: Infinity, label: '>$450' },
  ]
  
  const rangeCounts = dpsRanges.map(range => ({
    ...range,
    count: claims.filter(c => {
      const dps = c.carrierScopes[0]?.dollarPerSquare
      return dps !== null && dps !== undefined && dps >= range.min && dps < range.max
    }).length
  }))
  
  const maxCount = Math.max(...rangeCounts.map(r => r.count), 1)

  return (
    <div className="space-y-2">
      {rangeCounts.map((range) => (
        <div key={range.label} className="flex items-center gap-3">
          <span className="w-20 text-sm text-muted-foreground">{range.label}</span>
          <div className="flex-1 h-6 bg-muted rounded-lg overflow-hidden">
            <div
              className={`h-full rounded-lg transition-all ${
                range.min < 300 ? 'bg-red-400' :
                range.min < 350 ? 'bg-amber-400' :
                range.min < 400 ? 'bg-green-400' :
                'bg-emerald-500'
              }`}
              style={{ width: `${(range.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="w-8 text-sm text-right">{range.count}</span>
        </div>
      ))}
    </div>
  )
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

