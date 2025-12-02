import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectSchema } from '@/lib/validations/project'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = projectSchema.parse(body)
    
    // TODO: Get userId from authentication
    const userId = 'temp-user-id' // Replace with actual auth
    
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
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id' // Replace with actual auth
    
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
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
