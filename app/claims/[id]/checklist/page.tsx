import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { PhotoChecklist } from './PhotoChecklist'

export const metadata = {
  title: 'Build Day Checklist | QuickClaims',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function ChecklistPage({ params }: Props) {
  const { id } = await params

  const claim = await db.claim.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          clientName: true,
          address: true,
        },
      },
    },
  })

  if (!claim) {
    notFound()
  }

  // Get existing photo analyses to determine which items are done
  const photoAnalyses = await db.photoAnalysis.findMany({
    where: { claimId: id },
    select: {
      id: true,
      photoType: true,
      location: true,
    },
  })

  return (
    <PhotoChecklist
      claimId={id}
      projectId={claim.project.id}
      clientName={claim.project.clientName}
      address={claim.project.address}
      existingPhotos={photoAnalyses}
    />
  )
}
