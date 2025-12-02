'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface StartClaimButtonProps {
  projectId: string
}

export function StartClaimButton({ projectId }: StartClaimButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStartClaim = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create claim')
      }

      const { claim } = await response.json()
      router.push(`/claims/${claim.id}`)
    } catch (error) {
      console.error('Error creating claim:', error)
      alert(error instanceof Error ? error.message : 'Failed to create claim')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleStartClaim}
      loading={isLoading}
      className="gap-2"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Start Claim
    </Button>
  )
}
