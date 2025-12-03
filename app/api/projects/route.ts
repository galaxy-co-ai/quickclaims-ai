import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectSchema } from '@/lib/validations/project'
import { requireAuthUserId } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const userId = await requireAuthUserId()
    
    const body = await request.json()
    
    // Validate input
    const validatedData = projectSchema.parse(body)
    
    // Create project
    const project = await db.project.create({
      data: {
        userId,
        address: validatedData.address,
        clientName: validatedData.clientName,
        projectType: validatedData.projectType,
        status: 'created',
      },
    })
    
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get authenticated user
    const userId = await requireAuthUserId()
    
    const projects = await db.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { uploads: true, documents: true },
        },
      },
    })
    
    return NextResponse.json(projects)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
