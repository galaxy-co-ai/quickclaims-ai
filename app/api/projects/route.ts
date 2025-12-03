import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projectSchema } from '@/lib/validations/project'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = projectSchema.parse(body)
    
    // Using temp user for development
    const userId = process.env.TEMP_USER_ID || 'dev-user-001'
    
    // Ensure the development user exists (required for foreign key constraint)
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@quickclaims.dev`,
        name: 'Development User',
      },
    })
    
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
    // Using temp user for development
    const userId = process.env.TEMP_USER_ID || 'dev-user-001'
    
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
