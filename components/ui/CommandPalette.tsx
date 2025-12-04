'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, FileText, Building, ClipboardList, X, ArrowRight } from 'lucide-react'

interface SearchResult {
  projects: Array<{
    id: string
    clientName: string
    address: string
    projectType: string
    status: string
  }>
  claims: Array<{
    id: string
    carrier: string | null
    claimNumber: string | null
    status: string
    project: {
      clientName: string
      address: string
    }
  }>
  documents: Array<{
    id: string
    type: string
    title: string
    project: {
      id: string
      clientName: string
    }
  }>
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults(null)
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Handle keyboard shortcut to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Search with debounce
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setSelectedIndex(0)
      }
    } catch {
      // Search failed silently
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      search(value)
    }, 300)
  }

  // Build flat list of results for keyboard navigation
  const allResults: Array<{ type: 'project' | 'claim' | 'document'; item: unknown; key: string }> = []
  if (results) {
    results.projects.forEach(p => allResults.push({ type: 'project', item: p, key: `project-${p.id}` }))
    results.claims.forEach(c => allResults.push({ type: 'claim', item: c, key: `claim-${c.id}` }))
    results.documents.forEach(d => allResults.push({ type: 'document', item: d, key: `doc-${d.id}` }))
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && allResults[selectedIndex]) {
      e.preventDefault()
      handleSelect(allResults[selectedIndex])
    }
  }

  // Handle selection
  const handleSelect = (result: { type: 'project' | 'claim' | 'document'; item: unknown }) => {
    onClose()
    
    if (result.type === 'project') {
      const project = result.item as SearchResult['projects'][0]
      router.push(`/projects/${project.id}`)
    } else if (result.type === 'claim') {
      const claim = result.item as SearchResult['claims'][0]
      router.push(`/claims/${claim.id}`)
    } else if (result.type === 'document') {
      const doc = result.item as SearchResult['documents'][0]
      router.push(`/projects/${doc.project.id}?tab=documents`)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search projects, claims, and documents"
        className="fixed top-[10%] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
      >
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search projects, claims, documents..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              aria-label="Search query"
            />
            {isLoading && (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.length < 2 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Start typing to search...</p>
                <p className="text-sm mt-1">Search across projects, claims, and documents</p>
              </div>
            ) : results && allResults.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>No results found for &quot;{query}&quot;</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : results && allResults.length > 0 ? (
              <div className="py-2">
                {/* Projects */}
                {results.projects.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Projects
                    </div>
                    {results.projects.map((project, idx) => (
                      <button
                        key={project.id}
                        onClick={() => handleSelect({ type: 'project', item: project })}
                        className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted transition-colors ${
                          selectedIndex === idx ? 'bg-muted' : ''
                        }`}
                      >
                        <Building className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{project.clientName}</p>
                          <p className="text-sm text-muted-foreground truncate">{project.address}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Claims */}
                {results.claims.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Claims
                    </div>
                    {results.claims.map((claim, idx) => (
                      <button
                        key={claim.id}
                        onClick={() => handleSelect({ type: 'claim', item: claim })}
                        className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted transition-colors ${
                          selectedIndex === results.projects.length + idx ? 'bg-muted' : ''
                        }`}
                      >
                        <ClipboardList className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {claim.carrier || 'Unknown Carrier'} - {claim.claimNumber || 'No Claim #'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{claim.project.clientName}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Documents */}
                {results.documents.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Documents
                    </div>
                    {results.documents.map((doc, idx) => (
                      <button
                        key={doc.id}
                        onClick={() => handleSelect({ type: 'document', item: doc })}
                        className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted transition-colors ${
                          selectedIndex === results.projects.length + results.claims.length + idx ? 'bg-muted' : ''
                        }`}
                      >
                        <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{doc.title || doc.type}</p>
                          <p className="text-sm text-muted-foreground truncate">{doc.project.clientName}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
          
          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">↑↓</kbd> to navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">Enter</kbd> to select
                </span>
              </div>
              <span>
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border font-mono">Esc</kbd> to close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Hook to manage Command Palette state
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev),
  }
}
