'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

interface SupplementPackage {
  claim: {
    claimNumber: string | null
    carrier: string | null
    dateOfLoss: string | null
    policyType: string | null
  }
  insured: {
    name: string
    address: string
  }
  lineItems: Array<{
    lineNumber: number
    selector: string
    description: string
    quantity: number
    unit: string
    rcv: number
  }>
  defenseNotes: Array<{
    xactimateCode: string | null
    description: string
    ircCode: string | null
  }>
  photos: Array<{
    id: string
    type: string
    location: string | null
  }>
  totalRCV: number
  totalSupplementAmount: number
}

interface SupplementBuilderProps {
  claimId: string
  onSupplementSent?: () => void
}

export function SupplementBuilder({ claimId, onSupplementSent }: SupplementBuilderProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [packageData, setPackageData] = useState<SupplementPackage | null>(null)
  const [validation, setValidation] = useState<{
    isValid: boolean
    errors: string[]
    warnings: string[]
  } | null>(null)
  const [summary, setSummary] = useState<{
    totalItems: number
    totalSupplementAmount: number
    originalRCV: number
    newTotalRCV: number
    photoCount: number
    defenseNoteCount: number
  } | null>(null)

  // Form state for sending
  const [sentTo, setSentTo] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadPackageData()
  }, [claimId])

  const loadPackageData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/claims/${claimId}/supplement`)
      if (res.ok) {
        const data = await res.json()
        setPackageData(data.package)
        setValidation(data.validation)
        setSummary(data.summary)
      }
    } catch {
      toast.error('Could not load supplement package. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (format: 'document' | 'csv' | 'photos') => {
    window.open(`/api/claims/${claimId}/supplement?format=${format}`, '_blank')
  }

  const handleMarkSent = async () => {
    if (!validation?.isValid) {
      alert('Please fix validation errors before sending')
      return
    }

    setIsSending(true)
    try {
      const res = await fetch(`/api/claims/${claimId}/supplement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentTo: sentTo || packageData?.claim.carrier,
          notes,
          sentDate: new Date().toISOString(),
        })
      })

      if (res.ok) {
        onSupplementSent?.()
        router.refresh()
      }
    } catch {
      toast.error('Could not mark supplement as sent. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  if (!packageData || !summary) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h3 className="font-medium text-lg mb-2">No Supplement Data</h3>
          <p className="text-muted-foreground">
            Approve items in the Delta Analysis tab to build a supplement package.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Validation Alerts */}
      {validation && !validation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-medium text-red-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Missing Required Information
          </h4>
          <ul className="mt-2 space-y-1">
            {validation.errors.map((error, i) => (
              <li key={i} className="text-sm text-red-700">• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation && validation.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-medium text-amber-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Warnings
          </h4>
          <ul className="mt-2 space-y-1">
            {validation.warnings.map((warning, i) => (
              <li key={i} className="text-sm text-amber-700">• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Items</p>
            <p className="text-2xl font-bold">{summary.totalItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Supplement RCV</p>
            <p className="text-2xl font-bold text-green-600">
              +${summary.totalSupplementAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Original RCV</p>
            <p className="text-2xl font-bold">${summary.originalRCV.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">New Total</p>
            <p className="text-2xl font-bold text-primary">
              ${summary.newTotalRCV.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Claim Info */}
      <Card>
        <CardHeader>
          <CardTitle>Claim Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Carrier</p>
              <p className="font-medium">{packageData.claim.carrier || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Claim #</p>
              <p className="font-medium">{packageData.claim.claimNumber || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Insured</p>
              <p className="font-medium">{packageData.insured.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Property</p>
              <p className="font-medium">{packageData.insured.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Supplement Line Items ({packageData.lineItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2">#</th>
                  <th className="text-left py-2 px-2">Code</th>
                  <th className="text-left py-2 px-2">Description</th>
                  <th className="text-right py-2 px-2">Qty</th>
                  <th className="text-right py-2 px-2">Unit</th>
                  <th className="text-right py-2 px-2">RCV</th>
                </tr>
              </thead>
              <tbody>
                {packageData.lineItems.map((item) => (
                  <tr key={item.lineNumber} className="border-b border-border/50">
                    <td className="py-2 px-2">{item.lineNumber}</td>
                    <td className="py-2 px-2 font-mono text-xs">{item.selector || '—'}</td>
                    <td className="py-2 px-2">{item.description}</td>
                    <td className="py-2 px-2 text-right">{item.quantity}</td>
                    <td className="py-2 px-2 text-right">{item.unit}</td>
                    <td className="py-2 px-2 text-right font-medium">${item.rcv.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-medium">
                  <td colSpan={5} className="py-2 px-2 text-right">Total:</td>
                  <td className="py-2 px-2 text-right">${summary.totalSupplementAmount.toFixed(0)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Package Contents */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Defense Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">{summary.defenseNoteCount}</p>
            <p className="text-sm text-muted-foreground">
              {packageData.defenseNotes.filter(n => n.ircCode).length} with IRC code references
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Photo Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold mb-2">{summary.photoCount}</p>
            <p className="text-sm text-muted-foreground">
              Photos attached for evidence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Download Package</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => handleDownload('document')}>
              📄 Full Document (.txt)
            </Button>
            <Button variant="outline" onClick={() => handleDownload('csv')}>
              📊 Line Items (.csv)
            </Button>
            <Button variant="outline" onClick={() => handleDownload('photos')}>
              📷 Photo Index (.txt)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Send Supplement */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Send Supplement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sent To</label>
                <input
                  type="text"
                  value={sentTo}
                  onChange={(e) => setSentTo(e.target.value)}
                  placeholder={packageData.claim.carrier || 'Carrier/Adjuster name'}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes about submission"
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                This will update claim status to "Supplement Pending" and mark approved items as "Included".
              </p>
              <Button
                onClick={handleMarkSent}
                loading={isSending}
                disabled={!validation?.isValid}
              >
                Mark as Sent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
