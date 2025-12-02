import { db } from '@/lib/db'
import { AnalyticsDashboard } from './AnalyticsDashboard'

export const metadata = {
  title: 'Claims Analytics | QuickClaims',
}

export default async function ClaimsAnalyticsPage() {
  // Get all claims with their scopes for analytics
  const claims = await db.claim.findMany({
    include: {
      project: {
        select: {
          clientName: true,
          address: true,
        }
      },
      carrierScopes: {
        orderBy: { version: 'desc' },
        take: 1,
        include: {
          lineItems: true,
        }
      },
      deltas: true,
      activities: {
        orderBy: { createdAt: 'desc' },
      }
    },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate metrics
  const metrics = calculateMetrics(claims)
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Claims Analytics</h1>
        <p className="text-muted-foreground">
          Track performance metrics and claim status across your portfolio
        </p>
      </div>
      
      <AnalyticsDashboard claims={claims} metrics={metrics} />
    </div>
  )
}

interface ClaimWithRelations {
  id: string
  claimNumber: string | null
  status: string
  carrier: string | null
  createdAt: Date
  updatedAt: Date
  project: {
    clientName: string
    address: string
  }
  carrierScopes: Array<{
    totalRCV: number
    totalACV: number
    dollarPerSquare: number | null
    totalSquares: number | null
    lineItems: Array<{ rcv: number }>
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

function calculateMetrics(claims: ClaimWithRelations[]) {
  const totalClaims = claims.length
  const claimsWithScope = claims.filter(c => c.carrierScopes.length > 0)
  
  // Status distribution
  const statusCounts: Record<string, number> = {}
  claims.forEach(c => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1
  })
  
  // D$/SQ metrics
  const dpsValues = claimsWithScope
    .map(c => c.carrierScopes[0]?.dollarPerSquare)
    .filter((v): v is number => v !== null && v > 0)
  
  const avgDPS = dpsValues.length > 0 
    ? dpsValues.reduce((a, b) => a + b, 0) / dpsValues.length 
    : 0
  
  const minDPS = dpsValues.length > 0 ? Math.min(...dpsValues) : 0
  const maxDPS = dpsValues.length > 0 ? Math.max(...dpsValues) : 0
  
  // RCV metrics
  const totalRCV = claimsWithScope.reduce(
    (sum, c) => sum + (c.carrierScopes[0]?.totalRCV || 0), 0
  )
  
  // Supplement metrics
  const claimsWithSupplements = claims.filter(c => 
    c.deltas.some(d => d.status === 'approved' || d.status === 'included')
  )
  
  const totalSupplementRCV = claims.reduce((sum, c) => {
    const approvedDeltas = c.deltas.filter(d => d.status === 'approved' || d.status === 'included')
    return sum + approvedDeltas.reduce((s, d) => s + (d.estimatedRCV || 0), 0)
  }, 0)
  
  // Carrier breakdown
  const carrierCounts: Record<string, { count: number; totalRCV: number; avgDPS: number[] }> = {}
  claimsWithScope.forEach(c => {
    const carrier = c.carrier || 'Unknown'
    if (!carrierCounts[carrier]) {
      carrierCounts[carrier] = { count: 0, totalRCV: 0, avgDPS: [] }
    }
    carrierCounts[carrier].count++
    carrierCounts[carrier].totalRCV += c.carrierScopes[0]?.totalRCV || 0
    const dps = c.carrierScopes[0]?.dollarPerSquare
    if (dps) carrierCounts[carrier].avgDPS.push(dps)
  })
  
  const carrierStats = Object.entries(carrierCounts).map(([carrier, data]) => ({
    carrier,
    count: data.count,
    totalRCV: data.totalRCV,
    avgDPS: data.avgDPS.length > 0 
      ? data.avgDPS.reduce((a, b) => a + b, 0) / data.avgDPS.length 
      : 0
  })).sort((a, b) => b.count - a.count)
  
  // Monthly trend (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  
  const monthlyData: Record<string, { claims: number; rcv: number; dps: number[] }> = {}
  claimsWithScope.forEach(c => {
    if (c.createdAt >= sixMonthsAgo) {
      const monthKey = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, '0')}`
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { claims: 0, rcv: 0, dps: [] }
      }
      monthlyData[monthKey].claims++
      monthlyData[monthKey].rcv += c.carrierScopes[0]?.totalRCV || 0
      const dps = c.carrierScopes[0]?.dollarPerSquare
      if (dps) monthlyData[monthKey].dps.push(dps)
    }
  })
  
  const monthlyTrend = Object.entries(monthlyData)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, data]) => ({
      month,
      claims: data.claims,
      rcv: data.rcv,
      avgDPS: data.dps.length > 0 
        ? data.dps.reduce((a, b) => a + b, 0) / data.dps.length 
        : 0
    }))
  
  return {
    totalClaims,
    claimsWithScope: claimsWithScope.length,
    claimsWithSupplements: claimsWithSupplements.length,
    totalRCV,
    totalSupplementRCV,
    avgDPS,
    minDPS,
    maxDPS,
    statusCounts,
    carrierStats,
    monthlyTrend,
  }
}
