'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toast'

interface DefenseNote {
  deltaId: string
  xactimateCode: string | null
  description: string
  ircCode: string | null
  status: string
  defenseNote: string
  quantity: number | null
  unit: string | null
  estimatedRCV: number | null
}

interface DefenseNotesProps {
  claimId: string
  notes: DefenseNote[]
  onRefresh?: () => void
}

export function DefenseNotes({ claimId, notes, onRefresh }: DefenseNotesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleCopy = async (note: DefenseNote) => {
    try {
      await navigator.clipboard.writeText(note.defenseNote)
      setCopiedId(note.deltaId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Could not copy to clipboard. Please try again.')
    }
  }

  const handleCopyAll = async () => {
    try {
      const allNotes = notes.map(n => n.defenseNote).join('\n\n' + '='.repeat(60) + '\n\n')
      await navigator.clipboard.writeText(allNotes)
      setCopiedId('all')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Could not copy to clipboard. Please try again.')
    }
  }

  const handleDownloadPackage = () => {
    window.open(`/api/claims/${claimId}/defense-notes?format=package`, '_blank')
  }

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    try {
      const res = await fetch(`/api/claims/${claimId}/defense-notes`, {
        method: 'POST',
      })
      if (res.ok && onRefresh) {
        onRefresh()
      }
    } catch {
      toast.error('Could not regenerate defense notes. Please try again.')
    } finally {
      setIsRegenerating(false)
    }
  }

  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
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
          <h3 className="font-medium text-lg mb-2">No Defense Notes Yet</h3>
          <p className="text-muted-foreground">
            Approve items in the Delta Analysis tab to generate defense notes with IRC code references.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Defense Notes</h3>
          <p className="text-sm text-muted-foreground">
            {notes.length} approved item{notes.length !== 1 ? 's' : ''} with IRC code references
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
          >
            {copiedId === 'all' ? '✓ Copied!' : 'Copy All'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPackage}
          >
            Download Package
          </Button>
          <Button
            size="sm"
            onClick={handleRegenerate}
            loading={isRegenerating}
          >
            Regenerate Notes
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Items</p>
          <p className="text-2xl font-bold">{notes.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">With IRC Code</p>
          <p className="text-2xl font-bold">
            {notes.filter(n => n.ircCode).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Est. Total RCV</p>
          <p className="text-2xl font-bold">
            ${notes.reduce((sum, n) => sum + (n.estimatedRCV || 0), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-green-600 uppercase tracking-wide">Ready to Send</p>
          <p className="text-2xl font-bold text-green-600">
            {notes.filter(n => n.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Defense Notes List */}
      <div className="space-y-4">
        {notes.map((note) => {
          const isExpanded = expandedId === note.deltaId
          
          return (
            <Card key={note.deltaId}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {note.xactimateCode && (
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {note.xactimateCode}
                      </code>
                    )}
                    <CardTitle className="text-base">{note.description}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {note.ircCode && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        IRC {note.ircCode}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(note)}
                      className="h-8 px-2"
                    >
                      {copiedId === note.deltaId ? '✓' : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Preview */}
                <div 
                  className={`bg-muted/30 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap overflow-hidden ${
                    isExpanded ? '' : 'max-h-32'
                  }`}
                >
                  {note.defenseNote}
                </div>
                
                {/* Expand/Collapse */}
                {note.defenseNote.length > 400 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : note.deltaId)}
                    className="text-sm text-primary hover:underline mt-2"
                  >
                    {isExpanded ? 'Show less' : 'Show full note'}
                  </button>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
                  {note.quantity && note.unit && (
                    <span>Qty: {note.quantity} {note.unit}</span>
                  )}
                  {note.estimatedRCV && (
                    <span>Est. RCV: ${note.estimatedRCV.toLocaleString()}</span>
                  )}
                  <span className="capitalize">Status: {note.status}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Download Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Ready to Submit?</h4>
              <p className="text-sm text-muted-foreground">
                Download the complete defense package with all approved items and IRC references.
              </p>
            </div>
            <Button onClick={handleDownloadPackage}>
              Download Supplement Package
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
