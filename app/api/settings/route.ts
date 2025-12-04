import { NextRequest, NextResponse } from 'next/server'
import { requireAuthUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { userPreferencesSchema, defaultPreferences } from '@/lib/validations/settings'
import { z } from 'zod'

/**
 * GET /api/settings
 * Get user preferences
 */
export async function GET() {
  try {
    const userId = await requireAuthUserId()
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { preferences: true }
    })
    
    // Merge with defaults to ensure all fields exist
    const preferences = {
      ...defaultPreferences,
      ...(user?.preferences as Record<string, unknown> || {}),
    }
    
    return NextResponse.json({ preferences })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

/**
 * PATCH /api/settings
 * Update user preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = await requireAuthUserId()
    const body = await request.json()
    
    // Validate the incoming preferences
    const validated = userPreferencesSchema.parse(body)
    
    // Get current preferences
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { preferences: true }
    })
    
    // Merge new preferences with existing ones
    const currentPrefs = (user?.preferences as Record<string, unknown>) || {}
    const newPrefs = {
      ...currentPrefs,
      ...validated,
    }
    
    // Update user preferences
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { preferences: newPrefs },
      select: { preferences: true }
    })
    
    return NextResponse.json({ 
      success: true,
      preferences: updatedUser.preferences 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid preferences', 
        details: error.issues 
      }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 })
  }
}
