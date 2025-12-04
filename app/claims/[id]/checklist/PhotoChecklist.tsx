'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  PHOTO_CHECKLIST, 
  getAllChecklistItems, 
  getRequiredItems,
  calculateCompletion 
} from '@/lib/claims/photo-checklist'
import { toast } from '@/components/ui/Toast'

interface PhotoChecklistProps {
  claimId: string
  projectId: string
  clientName: string
  address: string
  existingPhotos: Array<{
    id: string
    photoType: string
    location: string | null
  }>
}

export function PhotoChecklist({
  claimId,
  projectId,
  clientName,
  address,
  existingPhotos,
}: PhotoChecklistProps) {
  // Track completed items locally
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`checklist-${claimId}`)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null)

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`checklist-${claimId}`, JSON.stringify(completedIds))
  }, [completedIds, claimId])

  const allItems = getAllChecklistItems()
  const requiredItems = getRequiredItems()
  const totalCompletion = calculateCompletion(completedIds)
  const requiredCompletion = calculateCompletion(completedIds, true)

  const toggleItem = (itemId: string) => {
    setCompletedIds(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handlePhotoCapture = async (itemId: string, file: File) => {
    setIsUploading(true)
    setUploadingItemId(itemId)
    
    try {
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
      
      // Get item details for photoType
      const item = allItems.find(i => i.id === itemId)
      
      // Analyze photo
      await fetch(`/api/claims/${claimId}/analyze-photo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: upload.id,
          photoType: item?.category || 'documentation',
          location: item?.title,
        }),
      })

      // Mark as complete
      if (!completedIds.includes(itemId)) {
        setCompletedIds(prev => [...prev, itemId])
      }
    } catch {
      toast.error('Could not upload photo. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadingItemId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border safe-top">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/claims/${claimId}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to Claim
            </Link>
            <span className="text-sm font-medium text-primary">
              {totalCompletion.percentage}% Complete
            </span>
          </div>
          <h1 className="font-semibold">Build Day Checklist</h1>
          <p className="text-sm text-muted-foreground truncate">{clientName} • {address}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${totalCompletion.percentage}%` }}
          />
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-xs text-muted-foreground uppercase">Required</p>
          <p className="text-lg font-bold">
            {requiredCompletion.completed}/{requiredCompletion.total}
          </p>
          <div className="h-1 bg-muted rounded-full mt-1">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${requiredCompletion.percentage}%` }}
            />
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3">
          <p className="text-xs text-muted-foreground uppercase">All Items</p>
          <p className="text-lg font-bold">
            {totalCompletion.completed}/{totalCompletion.total}
          </p>
          <div className="h-1 bg-muted rounded-full mt-1">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${totalCompletion.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="px-4 space-y-3">
        {PHOTO_CHECKLIST.map((category) => {
          const categoryItems = category.items
          const categoryCompletion = calculateCompletion(
            completedIds.filter(id => categoryItems.some(item => item.id === id))
          )
          const categoryRequiredCompletion = calculateCompletion(
            completedIds.filter(id => categoryItems.some(item => item.id === id && item.required)),
            true
          )
          const isExpanded = activeCategory === category.id

          return (
            <div key={category.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setActiveCategory(isExpanded ? null : category.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <div>
                    <h2 className="font-medium">{category.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {categoryCompletion.completed}/{categoryItems.length} complete
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {categoryRequiredCompletion.percentage === 100 && (
                    <span className="text-green-500">✓</span>
                  )}
                  <svg
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="border-t border-border divide-y divide-border">
                  {categoryItems.map((item) => {
                    const isComplete = completedIds.includes(item.id)
                    const isItemUploading = uploadingItemId === item.id

                    return (
                      <div key={item.id} className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              isComplete
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-muted-foreground'
                            }`}
                          >
                            {isComplete && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-medium ${isComplete ? 'text-muted-foreground line-through' : ''}`}>
                                {item.title}
                              </h3>
                              {item.required && (
                                <span className="text-xs text-red-500">Required</span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {item.description}
                            </p>
                            
                            {/* Tips */}
                            {item.tips && item.tips.length > 0 && (
                              <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                                <strong>Tips:</strong>
                                <ul className="mt-1 space-y-0.5">
                                  {item.tips.map((tip, i) => (
                                    <li key={i}>• {tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Xactimate Codes */}
                            {item.xactimateRelevant && item.xactimateRelevant.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {item.xactimateRelevant.map((code) => (
                                  <span
                                    key={code}
                                    className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded font-mono"
                                  >
                                    {code}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Camera Button */}
                          <label className="flex-shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handlePhotoCapture(item.id, file)
                                e.target.value = ''
                              }}
                              disabled={isUploading}
                            />
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                              isItemUploading
                                ? 'bg-muted text-muted-foreground'
                                : isComplete
                                ? 'bg-green-100 text-green-600'
                                : 'bg-primary/10 text-primary'
                            }`}>
                              {isItemUploading ? (
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              )}
                            </span>
                          </label>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom Safe Area */}
      <div className="h-20 safe-bottom" />

      {/* Floating Action Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border p-4 safe-bottom">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div>
            <p className="text-sm font-medium">
              {requiredCompletion.completed === requiredCompletion.total
                ? '✓ All required photos complete!'
                : `${requiredCompletion.total - requiredCompletion.completed} required photos remaining`
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {existingPhotos.length} photos uploaded to claim
            </p>
          </div>
          <Link
            href={`/claims/${claimId}`}
            className="h-10 px-4 rounded-lg bg-primary text-primary-foreground font-medium flex items-center gap-2"
          >
            Done
          </Link>
        </div>
      </div>
    </div>
  )
}
