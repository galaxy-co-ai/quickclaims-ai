'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClaimSummaryCard, LineItemsTable, ScopeUploader, DeltaList } from '@/components/claims'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface PhotoAnalysis {
  id: string
  photoType: string
  location: string | null
  analysisStatus: string
  uploadId: string
  analyzedAt: string | null
  detectedComponents: unknown[] | null
  detectedDamage: unknown[] | null
}

interface DeltaItem {
  id: string
  deltaType: string
  status: string
  xactimateCode: string | null
  description: string
  category: string | null
  ircCode: string | null
  defenseNote: string | null
  quantity: number | null
  unit: string | null
  estimatedRCV: number | null
  evidenceNotes: string | null
  photoAnalysis?: {
    id: string
    photoType: string
    location: string | null
  } | null
}

interface ClaimDetailClientProps {
  claim: {
    id: string
    claimNumber: string | null
    carrier: string | null
    status: string
    dateOfLoss: string | null
    deductible: number | null
    adjusterName: string | null
    adjusterEmail: string | null
    adjusterPhone: string | null
    policyType: string | null
  }
  project: {
    id: string
    clientName: string
    address: string
  }
  summary: {
    latestVersion: number
    totalRCV: number
    totalACV: number
    totalDepreciation: number
    deductible: number
    netPayment: number
    totalSquares: number | null
    dollarPerSquare: number | null
    lineItemCount: number
  } | null
  lineItems: Array<{
    id: string
    lineNumber: number | null
    xactimateCode: string | null
    description: string
    category: string
    area: string | null
    quantity: number
    unit: string
    unitPrice: number
    rcv: number
    depreciation: number
    acv: number
    ageLife: string | null
    isSupplemented: boolean
  }>
  activities: Array<{
    id: string
    action: string
    description: string | null
    createdAt: string
  }>
  scopeCount: number
  initialPhotoCount: number
  initialDeltaCount: number
}

export function ClaimDetailClient({
  claim,
  project,
  summary,
  lineItems,
  activities,
  scopeCount,
  initialPhotoCount,
  initialDeltaCount,
}: ClaimDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'scope' | 'photos' | 'deltas' | 'activity'>('scope')
  const [photos, setPhotos] = useState<PhotoAnalysis[]>([])
  const [deltas, setDeltas] = useState<DeltaItem[]>([])
  const [photoCount, setPhotoCount] = useState(initialPhotoCount)
  const [deltaCount, setDeltaCount] = useState(initialDeltaCount)
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false)
  const [isLoadingDeltas, setIsLoadingDeltas] = useState(false)
  const [isGeneratingDeltas, setIsGeneratingDeltas] = useState(false)

  const handleScopeParsed = () => {
    router.refresh()
  }

  // Load photos when tab is selected
  useEffect(() => {
    if (activeTab === 'photos' && photos.length === 0 && photoCount > 0) {
      loadPhotos()
    }
  }, [activeTab])

  // Load deltas when tab is selected
  useEffect(() => {
    if (activeTab === 'deltas' && deltas.length === 0) {
      loadDeltas()
    }
  }, [activeTab])

  const loadPhotos = async () => {
    setIsLoadingPhotos(true)
    try {
      const res = await fetch(`/api/claims/${claim.id}/analyze-photo`)
      if (res.ok) {
        const data = await res.json()
        setPhotos(data.photoAnalyses || [])
        setPhotoCount(data.photoAnalyses?.length || 0)
      }
    } catch (error) {
      console.error('Failed to load photos:', error)
    } finally {
      setIsLoadingPhotos(false)
    }
  }

  const loadDeltas = async () => {
    setIsLoadingDeltas(true)
    try {
      const res = await fetch(`/api/claims/${claim.id}/generate-deltas`)
      if (res.ok) {
        const data = await res.json()
        setDeltas(data.deltas || [])
        setDeltaCount(data.deltas?.length || 0)
      }
    } catch (error) {
      console.error('Failed to load deltas:', error)
    } finally {
      setIsLoadingDeltas(false)
    }
  }

  const generateDeltas = async () => {
    setIsGeneratingDeltas(true)
    try {
      const res = await fetch(`/api/claims/${claim.id}/generate-deltas`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setDeltas(data.deltas || [])
        setDeltaCount(data.deltas?.length || 0)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to generate deltas:', error)
    } finally {
      setIsGeneratingDeltas(false)
    }
  }

  const handleDeltaStatusChange = async (deltaId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/claims/${claim.id}/deltas/${deltaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setDeltas(prev => prev.map(d => 
          d.id === deltaId ? { ...d, status: newStatus } : d
        ))
      }
    } catch (error) {
      console.error('Failed to update delta status:', error)
    }
  }

  const handlePhotoUploaded = () => {
    loadPhotos()
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <ClaimSummaryCard
        claim={claim}
        summary={summary}
        project={project}
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('scope')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'scope'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Carrier Scope {scopeCount > 0 && `(v${scopeCount})`}
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'photos'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Photos {photoCount > 0 && `(${photoCount})`}
        </button>
        <button
          onClick={() => setActiveTab('deltas')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'deltas'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Delta Analysis {deltaCount > 0 && `(${deltaCount})`}
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'activity'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Activity ({activities.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'scope' && (
        <div className="space-y-6">
          {/* Upload New Scope or Show Line Items */}
          {lineItems.length === 0 ? (
            <ScopeUploader
              claimId={claim.id}
              projectId={project.id}
              onScopeParsed={handleScopeParsed}
            />
          ) : (
            <>
              {/* Actions Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium">
                    Statement of Loss v{summary?.latestVersion || 1}
                  </h3>
                  {summary?.dollarPerSquare && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      ${summary.dollarPerSquare.toFixed(0)}/SQ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // TODO: Export functionality
                    }}
                  >
                    Export CSV
                  </Button>
                  <ScopeUploaderMini
                    claimId={claim.id}
                    projectId={project.id}
                    onScopeParsed={handleScopeParsed}
                  />
                </div>
              </div>

              {/* Missing Items Alert */}
              <MissingItemsAlert lineItems={lineItems} />

              {/* Line Items Table */}
              <LineItemsTable lineItems={lineItems} />
            </>
          )}
        </div>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          {/* Photo Upload */}
          <PhotoUploader
            claimId={claim.id}
            projectId={project.id}
            onPhotoUploaded={handlePhotoUploaded}
          />

          {/* Photo List */}
          {isLoadingPhotos ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : photos.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No photos uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Upload photos to enable AI analysis and delta detection
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Deltas Tab */}
      {activeTab === 'deltas' && (
        <div className="space-y-6">
          {/* Generate Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delta Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Compare carrier scope against photo evidence and code requirements
              </p>
            </div>
            <Button
              onClick={generateDeltas}
              loading={isGeneratingDeltas}
              disabled={!summary}
            >
              {deltas.length > 0 ? 'Re-run Analysis' : 'Run Analysis'}
            </Button>
          </div>

          {!summary ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Upload a carrier scope first</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Delta analysis compares the carrier scope against requirements
                </p>
              </CardContent>
            </Card>
          ) : isLoadingDeltas ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <DeltaList
              deltas={deltas}
              onStatusChange={handleDeltaStatusChange}
              showActions={true}
            />
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Claim Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity yet</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description || activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Photo uploader component
function PhotoUploader({
  claimId,
  projectId,
  onPhotoUploaded,
}: {
  claimId: string
  projectId: string
  onPhotoUploaded: () => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('rooftop')
  const [location, setLocation] = useState('')

  const PHOTO_TYPES = [
    { value: 'ground', label: 'Ground Level' },
    { value: 'edge', label: 'Edge/Drip' },
    { value: 'rooftop', label: 'Rooftop' },
    { value: 'component', label: 'Component' },
    { value: 'damage', label: 'Damage' },
    { value: 'attic', label: 'Attic' },
  ]

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        // Upload file
        const formData = new FormData()
        formData.append('file', file)
        formData.append('projectId', projectId)
        formData.append('fileType', 'photo')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error('Upload failed')

        const { upload } = await uploadResponse.json()

        // Analyze photo
        await fetch(`/api/claims/${claimId}/analyze-photo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uploadId: upload.id,
            photoType: selectedType,
            location: location || undefined,
          }),
        })
      }

      onPhotoUploaded()
    } catch (error) {
      console.error('Error uploading photos:', error)
    } finally {
      setIsUploading(false)
      e.target.value = '' // Reset input
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Photo Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background"
            >
              {PHOTO_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Front elevation, North side"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background"
            />
          </div>
          <div className="flex items-end">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <span className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all cursor-pointer">
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Upload Photos'
                )}
              </span>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Photo card component
function PhotoCard({ photo }: { photo: PhotoAnalysis }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const components = (photo.detectedComponents as Array<{ component: string; present: boolean; condition?: string }>) || []
  const damage = (photo.detectedDamage as Array<{ damageType: string; severity: string; description: string }>) || []

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    analyzing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-medium capitalize">{photo.photoType} Photo</p>
            {photo.location && (
              <p className="text-sm text-muted-foreground">{photo.location}</p>
            )}
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[photo.analysisStatus] || 'bg-gray-100'}`}>
            {photo.analysisStatus}
          </span>
        </div>

        {photo.analysisStatus === 'completed' && (
          <>
            <div className="flex gap-4 text-sm mb-3">
              <div>
                <span className="text-muted-foreground">Components:</span>{' '}
                <span className="font-medium">{components.filter(c => c.present).length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Damage:</span>{' '}
                <span className="font-medium">{damage.length}</span>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-primary hover:underline"
            >
              {isExpanded ? 'Hide details' : 'Show details'}
            </button>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-border space-y-3">
                {components.filter(c => c.present).length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Detected Components
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {components.filter(c => c.present).map((c, i) => (
                        <span
                          key={i}
                          className="text-xs bg-muted px-2 py-0.5 rounded"
                        >
                          {c.component}
                          {c.condition && c.condition !== 'good' && (
                            <span className="text-amber-600 ml-1">({c.condition})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {damage.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Damage Detected
                    </p>
                    <div className="space-y-1">
                      {damage.map((d, i) => (
                        <div key={i} className="text-sm">
                          <span className="font-medium capitalize">{d.damageType}</span>
                          <span className={`text-xs ml-2 ${
                            d.severity === 'severe' ? 'text-red-600' :
                            d.severity === 'moderate' ? 'text-orange-600' : 'text-yellow-600'
                          }`}>
                            ({d.severity})
                          </span>
                          <p className="text-xs text-muted-foreground">{d.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Mini uploader for adding new scope versions
function ScopeUploaderMini({
  claimId,
  projectId,
  onScopeParsed,
}: {
  claimId: string
  projectId: string
  onScopeParsed: () => void
}) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Upload file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', projectId)
      formData.append('fileType', 'scope')

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error('Upload failed')

      const { upload } = await uploadResponse.json()

      // Parse scope
      const parseResponse = await fetch(`/api/claims/${claimId}/parse-scope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId: upload.id }),
      })

      if (!parseResponse.ok) throw new Error('Parse failed')

      onScopeParsed()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <label className="cursor-pointer">
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />
      <span className="inline-flex items-center justify-center h-9 px-3 text-sm rounded-lg font-medium border border-border bg-transparent hover:bg-muted/50 text-foreground transition-all cursor-pointer">
        {isUploading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </>
        ) : 'Upload New SOL'}
      </span>
    </label>
  )
}

// Alert showing potentially missing items
function MissingItemsAlert({
  lineItems,
}: {
  lineItems: Array<{ xactimateCode: string | null; description: string }>
}) {
  const descriptions = lineItems.map(i => i.description.toLowerCase())
  const codes = lineItems.map(i => i.xactimateCode?.toUpperCase()).filter(Boolean)

  const missing: Array<{ name: string; code: string }> = []

  // Check common missing items
  if (!codes.includes('RFGDRIP') && !descriptions.some(d => d.includes('drip edge'))) {
    missing.push({ name: 'Drip Edge', code: 'R905.2.8.5' })
  }
  if (!codes.includes('RFGSTRT') && !descriptions.some(d => d.includes('starter'))) {
    missing.push({ name: 'Starter Course', code: 'R904.1' })
  }
  if (!codes.some(c => c?.startsWith('RFGRIDG')) && !descriptions.some(d => d.includes('ridge') || d.includes('hip'))) {
    missing.push({ name: 'Hip/Ridge Cap', code: '' })
  }

  if (missing.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h4 className="font-medium text-amber-800">Potentially Missing Items</h4>
          <p className="text-sm text-amber-700 mt-1">
            The following items may be missing from the carrier scope:
          </p>
          <ul className="mt-2 space-y-1">
            {missing.map((item) => (
              <li key={item.name} className="text-sm text-amber-700 flex items-center gap-2">
                <span>•</span>
                <span className="font-medium">{item.name}</span>
                {item.code && (
                  <span className="text-xs bg-amber-200/50 px-1.5 py-0.5 rounded">
                    {item.code}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
