import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { db } from '@/lib/db'
import { z } from 'zod'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Schema for the request
const AnalyzeRequestSchema = z.object({
  uploadId: z.string(),
  projectId: z.string().optional(),
})

// Schema for photo tags result
const PhotoTagsSchema = z.object({
  tags: z.array(z.string()),
  category: z.enum(['roof', 'damage', 'before', 'after', 'exterior', 'interior', 'materials', 'measurement', 'overview', 'detail', 'uncategorized']),
  description: z.string(),
  damageDetected: z.boolean(),
  damageType: z.string().optional(),
  damageSeverity: z.enum(['none', 'minor', 'moderate', 'severe']).optional(),
  confidence: z.number().min(0).max(1),
})

export type PhotoTags = z.infer<typeof PhotoTagsSchema>

/**
 * POST /api/photos/analyze
 * Analyze a single photo using GPT-4o Vision and save results to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uploadId } = AnalyzeRequestSchema.parse(body)

    // Get the upload record
    const upload = await db.upload.findUnique({
      where: { id: uploadId },
    })

    if (!upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      )
    }

    // Verify it's an image
    if (!upload.mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File is not an image' },
        { status: 400 }
      )
    }

    // Analyze with GPT-4o Vision
    const analysis = await analyzePhotoWithVision(upload.fileUrl, upload.fileName)

    // Save the analysis results to the Upload record
    await db.upload.update({
      where: { id: uploadId },
      data: {
        tags: analysis.tags,
        category: analysis.category,
        description: analysis.description,
        aiAnalysis: analysis as unknown as Record<string, unknown>,
        aiAnalyzedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      uploadId,
      analysis,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to analyze photo', details: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/photos/analyze
 * Analyze multiple photos at once (batch operation)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { uploadIds, projectId } = body as { uploadIds: string[]; projectId: string }

    if (!uploadIds || !Array.isArray(uploadIds) || uploadIds.length === 0) {
      return NextResponse.json(
        { error: 'uploadIds array is required' },
        { status: 400 }
      )
    }

    // Get all uploads that are images
    const uploads = await db.upload.findMany({
      where: {
        id: { in: uploadIds },
        mimeType: { startsWith: 'image/' },
      },
    })

    // Analyze each photo (in parallel, max 5 at a time)
    const results: Array<{ uploadId: string; analysis: PhotoTags | null; error?: string }> = []
    const batchSize = 5

    for (let i = 0; i < uploads.length; i += batchSize) {
      const batch = uploads.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(async (upload) => {
          try {
            const analysis = await analyzePhotoWithVision(upload.fileUrl, upload.fileName)
            
            // Save to database
            await db.upload.update({
              where: { id: upload.id },
              data: {
                tags: analysis.tags,
                category: analysis.category,
                description: analysis.description,
                aiAnalysis: analysis as unknown as Record<string, unknown>,
                aiAnalyzedAt: new Date(),
              },
            })
            
            return { uploadId: upload.id, analysis }
          } catch (error) {
            return { 
              uploadId: upload.id, 
              analysis: null, 
              error: error instanceof Error ? error.message : 'Analysis failed' 
            }
          }
        })
      )
      results.push(...batchResults)
    }

    return NextResponse.json({
      success: true,
      projectId,
      results,
      analyzed: results.filter(r => r.analysis).length,
      failed: results.filter(r => !r.analysis).length,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to analyze photos', details: errorMessage },
      { status: 500 }
    )
  }
}

/**
 * Analyze a photo using GPT-4o Vision
 */
async function analyzePhotoWithVision(imageUrl: string, fileName: string): Promise<PhotoTags> {
  const systemPrompt = `You are an expert at analyzing construction and roofing photos. 
Analyze this image and provide:

1. TAGS: Relevant keywords/tags for organizing the photo (e.g., "roof", "shingles", "hail-damage", "before-repair", "gutter", "flashing")
2. CATEGORY: Best category for the photo
3. DESCRIPTION: Brief description of what's in the photo
4. DAMAGE: Whether damage is visible and if so, what type and severity

Respond in JSON format:
{
  "tags": ["tag1", "tag2", ...],
  "category": "roof|damage|before|after|exterior|interior|materials|measurement|overview|detail|uncategorized",
  "description": "Brief description of the photo",
  "damageDetected": true/false,
  "damageType": "hail|wind|water|fire|impact|wear|none" (if damage detected),
  "damageSeverity": "none|minor|moderate|severe",
  "confidence": 0.0-1.0
}

Common tags to use:
- Location: roof, exterior, interior, attic, basement, garage
- Components: shingles, gutters, flashing, vents, skylights, chimney, fascia, soffit, siding
- Damage: hail-damage, wind-damage, water-damage, missing-shingles, lifted-shingles, dents
- Timing: before-repair, after-repair, during-work, initial-inspection
- Type: overview, close-up, detail, measurement, documentation`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'low' } // Use 'low' for faster/cheaper tagging
          },
          {
            type: 'text',
            text: `Analyze this construction/roofing photo. Filename: ${fileName}`
          }
        ]
      }
    ],
    max_tokens: 500,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from GPT-4o Vision')
  }

  const parsed = JSON.parse(content)
  return PhotoTagsSchema.parse(parsed)
}
