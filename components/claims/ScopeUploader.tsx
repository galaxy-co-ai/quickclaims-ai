'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ScopeUploaderProps {
  claimId: string
  projectId: string
  onScopeParsed?: (result: ScopeParseResult) => void
}

interface ScopeParseResult {
  carrierScope: {
    id: string
    version: number
    totalRCV: number
    totalACV: number
    dollarPerSquare: number | null
    lineItemCount: number
  }
  potentialMissing: string[]
}

export function ScopeUploader({ claimId, projectId, onScopeParsed }: ScopeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{
    id: string
    name: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // Upload to Vercel Blob
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', projectId)
      formData.append('fileType', 'scope')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      const uploadResult = await uploadResponse.json()
      setUploadedFile({
        id: uploadResult.upload.id,
        name: file.name,
      })

      // Now parse the scope
      setIsUploading(false)
      setIsParsing(true)

      const parseResponse = await fetch(`/api/claims/${claimId}/parse-scope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: uploadResult.upload.id }),
      })

      if (!parseResponse.ok) {
        const errorData = await parseResponse.json()
        throw new Error(errorData.error || 'Failed to parse scope')
      }

      const parseResult = await parseResponse.json()
      onScopeParsed?.(parseResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsUploading(false)
      setIsParsing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Upload Carrier Scope
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${isUploading || isParsing ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Uploading scope document...</p>
            </div>
          ) : isParsing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="animate-pulse">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                AI is analyzing the scope document...
              </p>
              <p className="text-xs text-muted-foreground">
                Extracting line items, calculating D$/SQ, identifying missing items
              </p>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <p className="text-sm text-muted-foreground mb-1">
                Upload carrier scope PDF (Statement of Loss)
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                PDF files up to 10MB
              </p>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Select PDF
              </Button>

              {uploadedFile && (
                <p className="mt-4 text-sm text-green-600">
                  ✓ Uploaded: {uploadedFile.name}
                </p>
              )}
            </>
          )}

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          <p className="font-medium mb-1">What happens when you upload:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>PDF text is extracted automatically</li>
            <li>AI identifies all line items with Xactimate codes</li>
            <li>RCV, ACV, and depreciation are calculated</li>
            <li>D$/SQ (Dollar Per Square) is calculated</li>
            <li>Potentially missing items are flagged</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
