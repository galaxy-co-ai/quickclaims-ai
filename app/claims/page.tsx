import { db } from '@/lib/db'
import Link from 'next/link'
import { CLAIM_STATUS_INFO, type ClaimStatus } from '@/lib/claims/schemas'

export default async function ClaimsPage() {
  const claims = await db.claim.findMany({
    include: {
      project: {
        select: {
          id: true,
          clientName: true,
          address: true,
        },
      },
      carrierScopes: {
        orderBy: { version: 'desc' },
        take: 1,
        select: {
          totalRCV: true,
          totalACV: true,
          dollarPerSquare: true,
          totalSquares: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Insurance Claims</h1>
              <p className="text-sm text-muted-foreground">
                Track carrier scopes, supplements, and D$/SQ
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/claims/analytics"
                className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {claims.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <svg
              className="w-12 h-12 mx-auto text-muted-foreground mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-lg font-semibold mb-2">No claims yet</h2>
            <p className="text-muted-foreground mb-4">
              Start a claim from any project page to begin tracking carrier scopes and supplements.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              View Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Claims</p>
                <p className="text-2xl font-bold">{claims.length}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total RCV</p>
                <p className="text-2xl font-bold">
                  ${claims.reduce((sum, c) => sum + (c.carrierScopes[0]?.totalRCV || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg D$/SQ</p>
                <p className="text-2xl font-bold">
                  ${Math.round(
                    claims.filter(c => c.carrierScopes[0]?.dollarPerSquare)
                      .reduce((sum, c) => sum + (c.carrierScopes[0]?.dollarPerSquare || 0), 0) /
                    (claims.filter(c => c.carrierScopes[0]?.dollarPerSquare).length || 1)
                  )}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">In Progress</p>
                <p className="text-2xl font-bold">
                  {claims.filter(c => c.status !== 'completed').length}
                </p>
              </div>
            </div>

            {/* Claims List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Client / Address</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Carrier</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">D$/SQ</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">RCV</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => {
                    const scope = claim.carrierScopes[0]
                    const statusInfo = CLAIM_STATUS_INFO[claim.status as ClaimStatus] || {
                      label: claim.status,
                      color: 'gray',
                    }

                    return (
                      <tr
                        key={claim.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={`/claims/${claim.id}`}
                            className="block hover:text-primary"
                          >
                            <p className="font-medium">{claim.project.clientName}</p>
                            <p className="text-sm text-muted-foreground">{claim.project.address}</p>
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm">{claim.carrier || 'Not set'}</p>
                          {claim.claimNumber && (
                            <p className="text-xs text-muted-foreground font-mono">{claim.claimNumber}</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `var(--${statusInfo.color}-100, #f3f4f6)`,
                              color: `var(--${statusInfo.color}-800, #1f2937)`,
                            }}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {scope?.dollarPerSquare ? (
                            <span className="text-sm font-medium">${scope.dollarPerSquare.toFixed(0)}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          {scope?.totalRCV ? (
                            <span className="text-sm font-medium">${scope.totalRCV.toLocaleString()}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/claims/${claim.id}`}
                            className="text-sm text-primary hover:underline"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
