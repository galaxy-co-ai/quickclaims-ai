import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUserId } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuthUserId()
    const query = request.nextUrl.searchParams.get('q')
    
    if (!query || query.length < 2) {
      return NextResponse.json({ projects: [], claims: [] })
    }
    
    // Search projects
    const projects = await db.project.findMany({
      where: {
        userId,
        OR: [
          { clientName: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { projectType: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        clientName: true,
        address: true,
        projectType: true,
        status: true,
      },
    })
    
    // Search claims by carrier or claim number
    const claims = await db.claim.findMany({
      where: {
        project: { userId },
        OR: [
          { carrier: { contains: query, mode: 'insensitive' } },
          { claimNumber: { contains: query, mode: 'insensitive' } },
          { project: { clientName: { contains: query, mode: 'insensitive' } } },
          { project: { address: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        carrier: true,
        claimNumber: true,
        status: true,
        project: {
          select: {
            clientName: true,
            address: true,
          },
        },
      },
    })
    
    // Search documents
    const documents = await db.document.findMany({
      where: {
        project: { userId },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { type: { contains: query, mode: 'insensitive' } },
          { project: { clientName: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        project: {
          select: {
            id: true,
            clientName: true,
          },
        },
      },
    })
    
    return NextResponse.json({
      projects,
      claims,
      documents,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
