"use client";

import Link from "next/link";
import { Card, CardContent, MetricCard, StatusBadge } from "@/components/ui";
import { CLAIM_STATUS_INFO, type ClaimStatus } from "@/lib/claims/schemas";

interface ClaimSummaryCardProps {
  claim: {
    id: string;
    claimNumber: string | null;
    carrier: string | null;
    status: string;
    dateOfLoss: string | null;
    deductible: number | null;
  };
  summary: {
    totalRCV: number;
    totalACV: number;
    totalDepreciation: number;
    deductible: number;
    netPayment: number;
    totalSquares: number | null;
    dollarPerSquare: number | null;
    lineItemCount: number;
  } | null;
  project: {
    clientName: string;
    address: string;
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Not set";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ClaimSummaryCard({ claim, summary }: ClaimSummaryCardProps) {
  const statusInfo = CLAIM_STATUS_INFO[claim.status as ClaimStatus] || {
    label: claim.status,
    color: "gray",
    description: "",
  };

  return (
    <div className="space-y-4">
      {/* Metrics Grid */}
      {summary ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* D$/SQ - The Key KPI */}
          <Card className="bg-primary-light border-primary/20">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">
                D$/SQ
              </p>
              <p className="text-3xl font-bold font-display text-primary">
                {summary.dollarPerSquare
                  ? `$${summary.dollarPerSquare.toFixed(0)}`
                  : "N/A"}
              </p>
              {summary.totalSquares && (
                <p className="text-sm text-primary/70 mt-1">
                  {summary.totalSquares.toFixed(1)} squares
                </p>
              )}
            </CardContent>
          </Card>

          {/* Total RCV */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                RCV
              </p>
              <p className="text-2xl font-bold font-display">
                {formatCurrency(summary.totalRCV)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {summary.lineItemCount} line items
              </p>
            </CardContent>
          </Card>

          {/* Depreciation */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Depreciation
              </p>
              <p className="text-2xl font-bold font-display text-warning-foreground">
                -{formatCurrency(summary.totalDepreciation)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {summary.totalRCV > 0
                  ? `${((summary.totalDepreciation / summary.totalRCV) * 100).toFixed(1)}%`
                  : "0%"}
              </p>
            </CardContent>
          </Card>

          {/* Net Payment */}
          <Card className="bg-success-light border-success/20">
            <CardContent className="p-4">
              <p className="text-xs font-medium text-success-foreground uppercase tracking-wide mb-1">
                Net Payment
              </p>
              <p className="text-2xl font-bold font-display text-success-foreground">
                {formatCurrency(summary.netPayment)}
              </p>
              <p className="text-sm text-success-foreground/70 mt-1">
                After ${summary.deductible.toLocaleString()} ded.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-foreground font-medium">No carrier scope uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a carrier scope PDF in the Scope tab to see claim metrics
            </p>
          </CardContent>
        </Card>
      )}

      {/* Claim Details */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Carrier
              </p>
              <p className="font-medium text-foreground">
                {claim.carrier || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Date of Loss
              </p>
              <p className="font-medium text-foreground">{formatDate(claim.dateOfLoss)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Deductible
              </p>
              <p className="font-medium text-foreground">
                {claim.deductible ? formatCurrency(claim.deductible) : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Current Stage
              </p>
              <p className="font-medium text-foreground">
                {statusInfo.description || statusInfo.label}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
