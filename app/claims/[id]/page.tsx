import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell, PageHeader } from "@/components/layout";
import { Button, StatusBadge } from "@/components/ui";
import { ClaimDetailClient } from "./ClaimDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClaimDetailPage({ params }: PageProps) {
  const { id } = await params;

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
        orderBy: { version: "desc" },
        include: {
          lineItems: {
            orderBy: { lineNumber: "asc" },
          },
        },
      },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      photoAnalyses: {
        select: { id: true },
      },
      deltas: {
        select: { id: true },
      },
    },
  });

  if (!claim) {
    notFound();
  }

  // Calculate summary from latest scope
  const latestScope = claim.carrierScopes[0];
  const summary = latestScope
    ? {
        latestVersion: latestScope.version,
        totalRCV: latestScope.totalRCV,
        totalACV: latestScope.totalACV,
        totalDepreciation: latestScope.totalDepreciation,
        deductible: latestScope.deductible,
        netPayment: latestScope.netPayment,
        totalSquares: latestScope.totalSquares,
        dollarPerSquare: latestScope.dollarPerSquare,
        lineItemCount: latestScope.lineItems.length,
      }
    : null;

  return (
    <AppShell mobileTitle={claim.project.clientName}>
      {/* Page Header */}
      <div className="mb-6">
        <Link
          href="/claims"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Claims
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
                {claim.project.clientName}
              </h1>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-muted-foreground">{claim.project.address}</p>
            {claim.carrier && (
              <p className="text-sm text-muted-foreground mt-1">
                {claim.carrier}
                {claim.claimNumber && (
                  <span className="ml-2 font-mono text-xs bg-muted px-2 py-0.5 rounded">
                    #{claim.claimNumber}
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/projects/${claim.project.id}`}>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View Project
              </Button>
            </Link>
            <Link href={`/claims/${claim.id}/checklist`}>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Photo Checklist
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
        lineItems={
          latestScope?.lineItems.map((item) => ({
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
          })) || []
        }
        activities={claim.activities.map((a) => ({
          id: a.id,
          action: a.action,
          description: a.description,
          createdAt: a.createdAt.toISOString(),
        }))}
        scopeCount={claim.carrierScopes.length}
        initialPhotoCount={claim.photoAnalyses.length}
        initialDeltaCount={claim.deltas.length}
      />
    </AppShell>
  );
}
