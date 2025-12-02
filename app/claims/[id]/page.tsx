import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ClaimDetailClient } from './ClaimDetailClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClaimDetailPage({ params }: PageProps) {
  const { id } = await params

  const claim = await db.claim.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          address: true,
          clientName: true,
          projectType: true,
        },
      },
      carrierScopes: {
        orderBy: { version: 'desc' },
        include: {
          lineItems: {
            orderBy: { lineNumber: 'asc' },
          },
        },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      photoAnalyses: {
        select: { id: true },
      },
      deltas: {
        select: { id: true },
      },
    },
  })

  if (!claim) {
    notFound()
  }

  // Calculate summary from latest scope
  const latestScope = claim.carrierScopes[0]
  const summary = latestScope ? {
    latestVersion: latestScope.version,
    totalRCV: latestScope.totalRCV,
    totalACV: latestScope.totalACV,
    totalDepreciation: latestScope.totalDepreciation,
    deductible: latestScope.deductible,
    netPayment: latestScope.netPayment,
    totalSquares: latestScope.totalSquares,
    dollarPerSquare: latestScope.dollarPerSquare,
    lineItemCount: latestScope.lineItems.length,
  } : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/claims" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-semibold">{claim.project.clientName}</h1>
                <p className="text-sm text-muted-foreground">{claim.project.address}</p>
              </div>
            </div>
            <Link
              href={`/projects/${claim.project.id}`}
              className="text-sm text-primary hover:underline"
            >
              View Project →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClaimDetailClient
          claim={{
            id: claim.id,
            claimNumber: claim.claimNumber,
            carrier: claim.carrier,
            status: claim.status,
            dateOfLoss: claim.dateOfLoss?.toISOString() || null,
            deductible: claim.deductible,
            adjusterName: claim.adjusterName,
            adjusterEmail: claim.adjusterEmail,
            adjusterPhone: claim.adjusterPhone,
            policyType: claim.policyType,
          }}
          project={{
            id: claim.project.id,
            clientName: claim.project.clientName,
            address: claim.project.address,
          }}
          summary={summary}
          lineItems={latestScope?.lineItems.map(item => ({
            id: item.id,
            lineNumber: item.lineNumber,
            xactimateCode: item.xactimateCode,
            description: item.description,
            category: item.category,
            area: item.area,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            rcv: item.rcv,
            depreciation: item.depreciation,
            acv: item.acv,
            ageLife: item.ageLife,
            isSupplemented: item.isSupplemented,
          })) || []}
          activities={claim.activities.map(a => ({
            id: a.id,
            action: a.action,
            description: a.description,
            createdAt: a.createdAt.toISOString(),
          }))}
          scopeCount={claim.carrierScopes.length}
          initialPhotoCount={claim.photoAnalyses.length}
          initialDeltaCount={claim.deltas.length}
        />
      </main>
    </div>
  )
}
