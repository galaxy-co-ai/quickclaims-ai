import { db } from '@/lib/db'
import { getXactimateCode, COMMONLY_MISSED_ITEMS } from '@/lib/claims/xactimate-codes'
import { ToolName, TOOL_DESCRIPTIONS } from './tools'
import {
  generateDeltaAnalysis as genDeltaAnalysis,
  generateCoverLetter as genCoverLetter,
  generateDefenseNotes as genDefenseNotes,
  generateSupplementLetter as genSupplementLetter,
  generateRebuttal as genRebuttal,
  generateProjectBrief as genProjectBrief,
  loadProjectContext,
  saveDocument
} from './document-generator'
import { parseCarrierScopeFromUrl } from './scope-parser'

// User ID is now passed in from the API route
let currentUserId: string | null = null

export function setCurrentUserId(userId: string) {
  currentUserId = userId
}

function getUserId(): string {
  if (!currentUserId) {
    throw new Error('User ID not set - call setCurrentUserId first')
  }
  return currentUserId
}

/**
 * Result of executing an AI tool
 */
export interface ToolResult {
  success: boolean
  message: string
  data?: unknown
  action?: {
    type: 'navigate' | 'refresh' | 'download' | 'toast'
    payload: unknown
  }
}

/**
 * Execute an AI tool with the given arguments
 */
export async function executeToolCall(
  toolName: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  const description = TOOL_DESCRIPTIONS[toolName as ToolName] || 'Processing'
  
  try {
    switch (toolName) {
      // ==========================================
      // PROJECT MANAGEMENT
      // ==========================================
      case 'create_project':
        return await createProject(args as {
          clientName: string
          address: string
          projectType: string
        })

      case 'list_projects':
        return await listProjects(args as {
          limit?: number
          status?: string
        })

      case 'get_project_details':
        return await getProjectDetails(args as {
          projectId?: string
          projectName?: string
        })

      case 'update_project':
        return await updateProject(args as {
          projectId: string
          clientName?: string
          address?: string
          projectType?: string
          status?: string
        })

      // ==========================================
      // FILE PROCESSING
      // ==========================================
      case 'parse_carrier_scope':
        return await parseCarrierScope(args as {
          fileUrl: string
          projectId?: string
        })

      // ==========================================
      // DOCUMENT GENERATION (AI-Powered)
      // ==========================================
      case 'generate_delta_analysis':
        return await generateDeltaAnalysisDoc(args as { projectId: string })

      case 'generate_cover_letter':
        return await generateCoverLetterDoc(args as { projectId: string })

      case 'generate_defense_notes':
        return await generateDefenseNotesDoc(args as { projectId: string })

      case 'generate_supplement_letter':
        return await generateSupplementLetterDoc(args as { projectId: string })

      case 'generate_rebuttal':
        return await generateRebuttalDoc(args as {
          projectId: string
          objection: string
          itemCode: string
        })

      case 'generate_project_brief':
        return await generateProjectBriefDoc(args as { projectId: string })

      case 'list_documents':
        return await listDocuments(args as { projectId?: string })

      // ==========================================
      // PHOTO ANALYSIS
      // ==========================================
      case 'analyze_photos':
        return await analyzePhotos(args as { projectId: string })

      // ==========================================
      // CLAIMS MANAGEMENT
      // ==========================================
      case 'create_claim':
        return await createClaim(args as {
          projectId: string
          carrier?: string
          claimNumber?: string
          dateOfLoss?: string
        })

      // ==========================================
      // NAVIGATION
      // ==========================================
      case 'navigate_to':
        return navigateTo(args as {
          page: string
          projectId?: string
          claimId?: string
          tab?: string
        })

      // ==========================================
      // KNOWLEDGE & LOOKUP
      // ==========================================
      case 'lookup_xactimate_code':
        return lookupXactimateCode(args as { code: string })

      case 'lookup_irc_code':
        return lookupIRCCode(args as { component: string })

      // ==========================================
      // EXPORTS
      // ==========================================
      case 'export_document':
        return exportDocument(args as {
          projectId: string
          documentType: string
          format: string
        })

      default:
        return {
          success: false,
          message: `Unknown tool: ${toolName}`,
        }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to execute ${description.toLowerCase()}: ${errorMessage}`,
    }
  }
}

// ==========================================
// IMPLEMENTATION: Project Management
// ==========================================

async function createProject(args: {
  clientName: string
  address: string
  projectType: string
}): Promise<ToolResult> {
  const project = await db.project.create({
    data: {
      userId: getUserId(),
      clientName: args.clientName,
      address: args.address,
      projectType: args.projectType,
      status: 'created',
    },
  })

  return {
    success: true,
    message: `Created project for **${args.clientName}** at ${args.address}`,
    data: {
      projectId: project.id,
      clientName: project.clientName,
      address: project.address,
      projectType: project.projectType,
    },
    action: {
      type: 'navigate',
      payload: { url: `/projects/${project.id}` },
    },
  }
}

async function listProjects(args: {
  limit?: number
  status?: string
}): Promise<ToolResult> {
  const projects = await db.project.findMany({
    where: {
      userId: getUserId(),
      ...(args.status && { status: args.status }),
    },
    take: args.limit || 10,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { uploads: true, documents: true } },
      claim: { select: { id: true, status: true, carrier: true } },
    },
  })

  if (projects.length === 0) {
    return {
      success: true,
      message: "You don't have any projects yet. Would you like me to create one?",
      data: { projects: [] },
    }
  }

  const projectList = projects.map((p) => ({
    id: p.id,
    clientName: p.clientName,
    address: p.address,
    projectType: p.projectType,
    status: p.status,
    filesCount: p._count.uploads,
    docsCount: p._count.documents,
    hasClaim: !!p.claim,
    claimStatus: p.claim?.status,
    carrier: p.claim?.carrier,
  }))

  return {
    success: true,
    message: `Found ${projects.length} project${projects.length === 1 ? '' : 's'}`,
    data: { projects: projectList },
  }
}

async function updateProject(args: {
  projectId: string
  clientName?: string
  address?: string
  projectType?: string
  status?: string
}): Promise<ToolResult> {
  // Verify project belongs to user
  const existingProject = await db.project.findFirst({
    where: { id: args.projectId, userId: getUserId() },
  })

  if (!existingProject) {
    return { success: false, message: 'Project not found' }
  }

  const updates: Record<string, string> = {}
  if (args.clientName) updates.clientName = args.clientName
  if (args.address) updates.address = args.address
  if (args.projectType) updates.projectType = args.projectType
  if (args.status) updates.status = args.status

  if (Object.keys(updates).length === 0) {
    return { success: false, message: 'No updates provided' }
  }

  const project = await db.project.update({
    where: { id: args.projectId },
    data: updates,
  })

  const changesList = Object.keys(updates).map(k => k.replace(/([A-Z])/g, ' $1').toLowerCase()).join(', ')

  return {
    success: true,
    message: `Updated **${project.clientName}**'s project (changed ${changesList})`,
    data: {
      projectId: project.id,
      clientName: project.clientName,
      address: project.address,
      projectType: project.projectType,
      status: project.status,
    },
  }
}

async function getProjectDetails(args: {
  projectId?: string
  projectName?: string
}): Promise<ToolResult> {
  let project

  if (args.projectId) {
    project = await db.project.findUnique({
      where: { id: args.projectId },
      include: {
        uploads: { orderBy: { createdAt: 'desc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        claim: {
          include: {
            deltas: { where: { status: 'approved' } },
            carrierScopes: { orderBy: { version: 'desc' }, take: 1 },
          },
        },
      },
    })
  } else if (args.projectName) {
    project = await db.project.findFirst({
      where: {
        userId: getUserId(),
        clientName: { contains: args.projectName, mode: 'insensitive' },
      },
      include: {
        uploads: { orderBy: { createdAt: 'desc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        claim: {
          include: {
            deltas: { where: { status: 'approved' } },
            carrierScopes: { orderBy: { version: 'desc' }, take: 1 },
          },
        },
      },
    })
  }

  if (!project) {
    return {
      success: false,
      message: args.projectId
        ? 'Project not found'
        : `Couldn't find a project matching "${args.projectName}"`,
    }
  }

  const photos = project.uploads.filter((u) => u.mimeType.startsWith('image/'))
  const scopes = project.uploads.filter((u) => u.fileType === 'scope')

  return {
    success: true,
    message: `Here's the details for **${project.clientName}**`,
    data: {
      id: project.id,
      clientName: project.clientName,
      address: project.address,
      projectType: project.projectType,
      status: project.status,
      createdAt: project.createdAt,
      stats: {
        totalFiles: project.uploads.length,
        photos: photos.length,
        scopes: scopes.length,
        documents: project.documents.length,
      },
      documents: project.documents.map((d) => ({
        type: d.type,
        title: d.title,
        createdAt: d.createdAt,
      })),
      claim: project.claim
        ? {
            id: project.claim.id,
            status: project.claim.status,
            carrier: project.claim.carrier,
            claimNumber: project.claim.claimNumber,
            approvedDeltas: project.claim.deltas.length,
            scopeRCV: project.claim.carrierScopes[0]?.totalRCV,
          }
        : null,
    },
  }
}

// ==========================================
// IMPLEMENTATION: Document Generation (AI-Powered)
// ==========================================

async function generateDeltaAnalysisDoc(args: { projectId: string }): Promise<ToolResult> {
  const context = await loadProjectContext(args.projectId)
  if (!context) {
    return { success: false, message: 'Project not found' }
  }

  try {
    const doc = await genDeltaAnalysis(context)
    const docId = await saveDocument(doc)
    
    return {
      success: true,
      message: `Generated **Delta Analysis Report** for **${context.clientName}**! This identifies all missing and underscoped items based on IRC code requirements. The document has been saved to the AI Docs tab.`,
      data: { documentId: docId, type: 'delta_analysis' },
      action: {
        type: 'navigate',
        payload: { url: `/projects/${args.projectId}?tab=documents` },
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to generate delta analysis: ${errorMessage}` }
  }
}

async function generateCoverLetterDoc(args: { projectId: string }): Promise<ToolResult> {
  const context = await loadProjectContext(args.projectId)
  if (!context) {
    return { success: false, message: 'Project not found' }
  }

  try {
    const doc = await genCoverLetter(context)
    const docId = await saveDocument(doc)
    
    return {
      success: true,
      message: `Generated **Cover Letter** for **${context.clientName}**! This is ready to send to the carrier with your supplement package. Saved to AI Docs tab.`,
      data: { documentId: docId, type: 'cover_letter' },
      action: {
        type: 'navigate',
        payload: { url: `/projects/${args.projectId}?tab=documents` },
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to generate cover letter: ${errorMessage}` }
  }
}

async function generateDefenseNotesDoc(args: { projectId: string }): Promise<ToolResult> {
  const context = await loadProjectContext(args.projectId)
  if (!context) {
    return { success: false, message: 'Project not found' }
  }

  try {
    const doc = await genDefenseNotes(context)
    const docId = await saveDocument(doc)
    
    return {
      success: true,
      message: `Generated **Defense Notes** for **${context.clientName}**! These are ready to copy directly into Xactimate line items. Each note includes IRC code citations.`,
      data: { documentId: docId, type: 'defense_notes' },
      action: {
        type: 'navigate',
        payload: { url: `/projects/${args.projectId}?tab=documents` },
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to generate defense notes: ${errorMessage}` }
  }
}

async function generateSupplementLetterDoc(args: { projectId: string }): Promise<ToolResult> {
  const context = await loadProjectContext(args.projectId)
  if (!context) {
    return { success: false, message: 'Project not found' }
  }

  try {
    const doc = await genSupplementLetter(context)
    const docId = await saveDocument(doc)
    
    return {
      success: true,
      message: `Generated comprehensive **Supplement Letter** for **${context.clientName}**! This includes all deltas, quantities, defense notes, and cost estimates. Ready for submission.`,
      data: { documentId: docId, type: 'supplement_letter' },
      action: {
        type: 'navigate',
        payload: { url: `/projects/${args.projectId}?tab=documents` },
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to generate supplement letter: ${errorMessage}` }
  }
}

async function generateRebuttalDoc(args: {
  projectId: string
  objection: string
  itemCode: string
}): Promise<ToolResult> {
  const context = await loadProjectContext(args.projectId)
  if (!context) {
    return { success: false, message: 'Project not found' }
  }

  try {
    const doc = await genRebuttal(context, args.objection, args.itemCode)
    const docId = await saveDocument(doc)
    
    return {
      success: true,
      message: `Generated **Rebuttal Response** for ${args.itemCode} objection. This is a professional, evidence-based counter with IRC citations. Ready to send.`,
      data: { documentId: docId, type: 'rebuttal', itemCode: args.itemCode },
      action: {
        type: 'navigate',
        payload: { url: `/projects/${args.projectId}?tab=documents` },
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to generate rebuttal: ${errorMessage}` }
  }
}

async function generateProjectBriefDoc(args: { projectId: string }): Promise<ToolResult> {
  const context = await loadProjectContext(args.projectId)
  if (!context) {
    return { success: false, message: 'Project not found' }
  }

  try {
    const doc = await genProjectBrief(context)
    const docId = await saveDocument(doc)
    
    return {
      success: true,
      message: `Generated **Project Brief** for **${context.clientName}**! This summarizes the project, scope, timeline, and next steps.`,
      data: { documentId: docId, type: 'project_brief' },
      action: {
        type: 'navigate',
        payload: { url: `/projects/${args.projectId}?tab=documents` },
      },
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to generate project brief: ${errorMessage}` }
  }
}

async function listDocuments(args: { projectId?: string }): Promise<ToolResult> {
  const where = args.projectId
    ? { projectId: args.projectId }
    : { project: { userId: getUserId() } }

  const documents = await db.document.findMany({
    where,
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      project: { select: { clientName: true } },
    },
  })

  if (documents.length === 0) {
    return {
      success: true,
      message: "No documents found. Generate some by going to a project's AI Docs tab!",
      data: { documents: [] },
    }
  }

  return {
    success: true,
    message: `Found ${documents.length} document${documents.length === 1 ? '' : 's'}`,
    data: {
      documents: documents.map((d) => ({
        id: d.id,
        type: d.type,
        title: d.title,
        projectName: d.project.clientName,
        createdAt: d.createdAt,
      })),
    },
  }
}

// ==========================================
// IMPLEMENTATION: File Processing
// ==========================================

async function parseCarrierScope(args: {
  fileUrl: string
  projectId?: string
}): Promise<ToolResult> {
  const userId = getUserId()
  
  try {
    let projectId = args.projectId
    
    // If no projectId provided, we'll need to parse first to get address, then find/create project
    if (!projectId) {
      // For now, require projectId - in future we could parse first, extract address, then find/create
      return {
        success: false,
        message: 'Project ID is required. Create a project first or specify which project this scope belongs to.',
      }
    }
    
    // Verify project belongs to user
    const project = await db.project.findFirst({
      where: { id: projectId, userId },
    })
    
    if (!project) {
      return { success: false, message: 'Project not found' }
    }
    
    // Parse the scope
    const result = await parseCarrierScopeFromUrl(args.fileUrl, projectId, userId)
    
    if (!result.success) {
      return {
        success: false,
        message: result.message,
      }
    }
    
    return {
      success: true,
      message: result.message,
      data: result.data,
      action: result.data?.claimId
        ? {
            type: 'navigate',
            payload: { url: `/projects/${projectId}?tab=overview` },
          }
        : undefined,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      message: `Failed to parse scope: ${errorMessage}`,
    }
  }
}

// ==========================================
// IMPLEMENTATION: Photo Analysis
// ==========================================

async function analyzePhotos(args: { projectId: string }): Promise<ToolResult> {
  const project = await db.project.findUnique({
    where: { id: args.projectId },
    select: {
      clientName: true,
      uploads: {
        where: { mimeType: { startsWith: 'image/' } },
        select: { id: true, aiAnalyzedAt: true },
      },
    },
  })

  if (!project) {
    return { success: false, message: 'Project not found' }
  }

  const photos = project.uploads
  const unanalyzed = photos.filter((p) => !p.aiAnalyzedAt)

  if (photos.length === 0) {
    return {
      success: true,
      message: `No photos found in **${project.clientName}**'s project. Upload some photos first!`,
      action: {
        type: 'navigate',
        payload: { url: `/projects/${args.projectId}?tab=photos` },
      },
    }
  }

  if (unanalyzed.length === 0) {
    return {
      success: true,
      message: `All ${photos.length} photos in **${project.clientName}**'s project have already been analyzed!`,
      data: { totalPhotos: photos.length, analyzed: photos.length },
    }
  }

  return {
    success: true,
    message: `I'll take you to **${project.clientName}**'s Photos tab. Click "AI Organize" to analyze ${unanalyzed.length} photo${unanalyzed.length === 1 ? '' : 's'}.`,
    data: { totalPhotos: photos.length, unanalyzed: unanalyzed.length },
    action: {
      type: 'navigate',
      payload: { url: `/projects/${args.projectId}?tab=photos` },
    },
  }
}

// ==========================================
// IMPLEMENTATION: Claims Management
// ==========================================

async function createClaim(args: {
  projectId: string
  carrier?: string
  claimNumber?: string
  dateOfLoss?: string
}): Promise<ToolResult> {
  // Check if claim already exists
  const existing = await db.claim.findUnique({
    where: { projectId: args.projectId },
  })

  if (existing) {
    return {
      success: false,
      message: 'This project already has an insurance claim associated with it.',
      data: { claimId: existing.id },
    }
  }

  const project = await db.project.findUnique({
    where: { id: args.projectId },
    select: { clientName: true },
  })

  if (!project) {
    return { success: false, message: 'Project not found' }
  }

  const claim = await db.claim.create({
    data: {
      projectId: args.projectId,
      carrier: args.carrier,
      claimNumber: args.claimNumber,
      dateOfLoss: args.dateOfLoss ? new Date(args.dateOfLoss) : undefined,
      status: 'intake',
    },
  })

  return {
    success: true,
    message: `Created insurance claim for **${project.clientName}**${args.carrier ? ` with ${args.carrier}` : ''}`,
    data: {
      claimId: claim.id,
      carrier: claim.carrier,
      claimNumber: claim.claimNumber,
    },
    action: {
      type: 'navigate',
      payload: { url: `/claims/${claim.id}` },
    },
  }
}


// ==========================================
// IMPLEMENTATION: Navigation
// ==========================================

function navigateTo(args: {
  page: string
  projectId?: string
  claimId?: string
  tab?: string
}): ToolResult {
  let url = '/'

  switch (args.page) {
    case 'dashboard':
      url = '/dashboard'
      break
    case 'projects':
      url = args.projectId
        ? `/projects/${args.projectId}${args.tab ? `?tab=${args.tab}` : ''}`
        : '/projects'
      break
    case 'documents':
      url = '/documents'
      break
    case 'analytics':
      url = '/analytics'
      break
    case 'settings':
      url = '/settings'
      break
    default:
      if (args.projectId) {
        url = `/projects/${args.projectId}${args.tab ? `?tab=${args.tab}` : ''}`
      } else if (args.claimId) {
        url = `/claims/${args.claimId}`
      }
  }

  const pageNames: Record<string, string> = {
    dashboard: 'Dashboard',
    projects: 'Projects',
    documents: 'Documents',
    analytics: 'Analytics',
    settings: 'Settings',
  }

  return {
    success: true,
    message: `Taking you to ${pageNames[args.page] || 'the page'}...`,
    action: {
      type: 'navigate',
      payload: { url },
    },
  }
}

// ==========================================
// IMPLEMENTATION: Knowledge & Lookup
// ==========================================

function lookupXactimateCode(args: { code: string }): ToolResult {
  const code = getXactimateCode(args.code.toUpperCase())

  if (!code) {
    // Try to find similar codes
    const similar = COMMONLY_MISSED_ITEMS.filter(
      (item) =>
        item.code.includes(args.code.toUpperCase()) ||
        item.name.toLowerCase().includes(args.code.toLowerCase())
    )

    if (similar.length > 0) {
      return {
        success: true,
        message: `Didn't find exact code "${args.code}", but here are related codes:`,
        data: {
          suggestions: similar.map((s) => ({
            code: s.code,
            name: s.name,
            reason: s.reason,
          })),
        },
      }
    }

    return {
      success: false,
      message: `Xactimate code "${args.code}" not found in our database. Try searching for the component name instead.`,
    }
  }

  return {
    success: true,
    message: `Here's info on **${code.code}**`,
    data: {
      code: code.code,
      description: code.description,
      unit: code.unit,
      category: code.category,
      ircCode: code.ircCode,
      notes: code.notes,
    },
  }
}

function lookupIRCCode(args: { component: string }): ToolResult {
  const component = args.component.toLowerCase()

  // Common IRC code mappings
  const ircCodes: Record<string, { code: string; requirement: string; details: string }> = {
    'drip edge': {
      code: 'R905.2.8.5',
      requirement: 'Drip edge is required at eaves and rake edges',
      details:
        'A drip edge shall be provided at eaves and rakes of shingle roofs. Adjacent segments of drip edge shall be overlapped a minimum of 2 inches.',
    },
    'ice and water': {
      code: 'R905.2.7.1',
      requirement: 'Ice barrier required in cold climates',
      details:
        'In areas where there has been a history of ice forming along the eaves causing a backup of water, an ice barrier shall be installed.',
    },
    'ice & water': {
      code: 'R905.2.7.1',
      requirement: 'Ice barrier required in cold climates',
      details:
        'In areas where there has been a history of ice forming along the eaves causing a backup of water, an ice barrier shall be installed.',
    },
    starter: {
      code: 'R905.2.8.1',
      requirement: 'Starter strip shingles required',
      details:
        'Starter strip shingles or the equivalent shall be applied at all roof eaves.',
    },
    'starter course': {
      code: 'R905.2.8.1',
      requirement: 'Starter strip shingles required',
      details:
        'Starter strip shingles or the equivalent shall be applied at all roof eaves.',
    },
    underlayment: {
      code: 'R905.2.7',
      requirement: 'Underlayment required under shingles',
      details:
        'Unless otherwise noted, required underlayment shall conform to ASTM D226 Type I, ASTM D4869 Type I, or ASTM D6757.',
    },
    flashing: {
      code: 'R905.2.8.3',
      requirement: 'Flashing required at wall intersections',
      details:
        'Base flashing and counter flashing shall be installed at wall and roof intersections.',
    },
    'step flashing': {
      code: 'R905.2.8.3',
      requirement: 'Step flashing required at roof-wall intersections',
      details:
        'Step flashing shall be used where a vertical surface meets a sloping roof. Minimum 4" x 4" flashing.',
    },
    valley: {
      code: 'R905.2.8.2',
      requirement: 'Valleys require flashing or woven shingles',
      details:
        'Valley linings shall be installed in accordance with manufacturer instructions where required.',
    },
    ridge: {
      code: 'R905.2.8',
      requirement: 'Ridge cap shingles required',
      details:
        'Hip and ridge shingles shall be installed on all hips and ridges.',
    },
    ventilation: {
      code: 'R806.1',
      requirement: 'Attic ventilation required',
      details:
        'Enclosed attics and enclosed rafter spaces shall have cross ventilation for each separate space by ventilating openings.',
    },
  }

  const match = ircCodes[component]

  if (!match) {
    // Try partial matching
    const partialMatch = Object.entries(ircCodes).find(([key]) =>
      key.includes(component) || component.includes(key)
    )

    if (partialMatch) {
      const [matchedComponent, data] = partialMatch
      return {
        success: true,
        message: `Found IRC requirements for **${matchedComponent}**`,
        data: {
          component: matchedComponent,
          ircCode: data.code,
          requirement: data.requirement,
          details: data.details,
        },
      }
    }

    return {
      success: false,
      message: `Couldn't find specific IRC requirements for "${args.component}". Try searching for: drip edge, ice & water, starter, underlayment, flashing, step flashing, valley, ridge, or ventilation.`,
    }
  }

  return {
    success: true,
    message: `Here are the IRC requirements for **${args.component}**`,
    data: {
      component: args.component,
      ircCode: match.code,
      requirement: match.requirement,
      details: match.details,
    },
  }
}

// ==========================================
// IMPLEMENTATION: Exports
// ==========================================

function exportDocument(args: {
  projectId: string
  documentType: string
  format: string
}): ToolResult {
  const url = `/api/exports/${args.projectId}/${args.documentType}${args.format === 'pdf' ? '/pdf' : '.csv'}`

  return {
    success: true,
    message: `Preparing ${args.documentType} ${args.format.toUpperCase()} for download...`,
    action: {
      type: 'download',
      payload: { url },
    },
  }
}
