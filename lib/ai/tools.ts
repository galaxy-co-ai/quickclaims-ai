import { ChatCompletionTool } from 'openai/resources/chat/completions'

/**
 * AI Assistant Tools Definition
 * 
 * These tools allow the AI to take actions on behalf of the user.
 * Each tool maps to an API endpoint or navigation action.
 */

export const AI_TOOLS: ChatCompletionTool[] = [
  // ==========================================
  // PROJECT MANAGEMENT
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'create_project',
      description: 'Create a new project for a client. Use this when the user wants to start a new roofing/restoration job.',
      parameters: {
        type: 'object',
        properties: {
          clientName: {
            type: 'string',
            description: 'The name of the client (homeowner or business)',
          },
          address: {
            type: 'string',
            description: 'The full property address including city, state, and ZIP',
          },
          projectType: {
            type: 'string',
            enum: ['Roof Replacement', 'Roof Repair', 'Storm Damage', 'Hail Damage', 'Wind Damage', 'Insurance Claim', 'General Restoration'],
            description: 'The type of project',
          },
        },
        required: ['clientName', 'address', 'projectType'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_projects',
      description: 'Get a list of all projects. Use this to show the user their existing projects or find a specific one.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Maximum number of projects to return (default 10)',
          },
          status: {
            type: 'string',
            enum: ['created', 'analyzing', 'ready', 'in-progress', 'completed'],
            description: 'Filter by project status',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_project_details',
      description: 'Get detailed information about a specific project including uploads, documents, and claim status.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The ID of the project to retrieve',
          },
          projectName: {
            type: 'string',
            description: 'The client name to search for if projectId is not known',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_project',
      description: 'Update an existing project\'s details like client name, address, or project type.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The ID of the project to update',
          },
          clientName: {
            type: 'string',
            description: 'New client name (optional)',
          },
          address: {
            type: 'string',
            description: 'New property address (optional)',
          },
          projectType: {
            type: 'string',
            enum: ['Roof Replacement', 'Roof Repair', 'Storm Damage', 'Hail Damage', 'Wind Damage', 'Insurance Claim', 'General Restoration'],
            description: 'New project type (optional)',
          },
          status: {
            type: 'string',
            enum: ['created', 'analyzing', 'ready', 'in-progress', 'completed'],
            description: 'New project status (optional)',
          },
        },
        required: ['projectId'],
      },
    },
  },

  // ==========================================
  // FILE PROCESSING
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'parse_carrier_scope',
      description: 'Parse a carrier scope PDF file and extract all data (address, carrier, claim #, line items, totals, D$/SQ). Automatically creates/updates claim and stores line items. Use this when user uploads a carrier scope PDF.',
      parameters: {
        type: 'object',
        properties: {
          fileUrl: {
            type: 'string',
            description: 'The URL of the carrier scope PDF file to parse',
          },
          projectId: {
            type: 'string',
            description: 'The project ID to associate the parsed scope with. If not provided, will try to find or create based on extracted address.',
          },
        },
        required: ['fileUrl'],
      },
    },
  },

  // ==========================================
  // DOCUMENT GENERATION (AI-Powered)
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'generate_delta_analysis',
      description: 'Generate a comprehensive Delta Analysis Report comparing carrier scope against code requirements and identifying missing items. This is one of the most powerful tools - use it when the user uploads a carrier scope or asks about missing items.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to generate delta analysis for',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_cover_letter',
      description: 'Generate a professional cover letter/email for submitting a supplement to the insurance carrier. Includes key deltas, code citations, and requested actions.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to generate cover letter for',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_defense_notes',
      description: 'Generate professional defense notes for each supplement line item with IRC code citations. These are ready to copy directly into Xactimate.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to generate defense notes for',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_supplement_letter',
      description: 'Generate a comprehensive supplement letter with all deltas, defense notes, quantities, and cost estimates. This is the full submission document.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to generate supplement letter for',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_rebuttal',
      description: 'Generate a professional rebuttal response to a carrier objection for a specific line item.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID',
          },
          objection: {
            type: 'string',
            description: 'The exact carrier objection text to rebut',
          },
          itemCode: {
            type: 'string',
            description: 'The Xactimate code of the item being objected to (e.g., RFGDRIP, RFGSTEP)',
          },
        },
        required: ['projectId', 'objection', 'itemCode'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_project_brief',
      description: 'Generate a project brief/summary document with key information, timeline, and next steps.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to generate brief for',
          },
        },
        required: ['projectId'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_documents',
      description: 'List all documents across projects or for a specific project.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'Optional project ID to filter documents',
          },
        },
      },
    },
  },

  // ==========================================
  // PHOTO ANALYSIS
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'analyze_photos',
      description: 'Use AI vision to analyze and tag photos in a project. Identifies damage, components, and categorizes images.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The ID of the project whose photos to analyze',
          },
        },
        required: ['projectId'],
      },
    },
  },

  // ==========================================
  // CLAIMS MANAGEMENT
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'create_claim',
      description: 'Create an insurance claim for a project. Use when the user wants to start tracking an insurance claim.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID to create a claim for',
          },
          carrier: {
            type: 'string',
            description: 'Insurance carrier name (e.g., State Farm, Allstate, USAA)',
          },
          claimNumber: {
            type: 'string',
            description: 'The insurance claim number if available',
          },
          dateOfLoss: {
            type: 'string',
            description: 'Date of the loss/damage event (YYYY-MM-DD format)',
          },
        },
        required: ['projectId'],
      },
    },
  },

  // ==========================================
  // NAVIGATION
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'navigate_to',
      description: 'Navigate the user to a specific page in the app.',
      parameters: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: ['dashboard', 'projects', 'documents', 'analytics', 'settings'],
            description: 'The page to navigate to',
          },
          projectId: {
            type: 'string',
            description: 'If navigating to a project detail page, the project ID',
          },
          claimId: {
            type: 'string',
            description: 'If navigating to a claim detail page, the claim ID',
          },
          tab: {
            type: 'string',
            enum: ['overview', 'files', 'documents', 'photos'],
            description: 'Optional tab to open on the project detail page',
          },
        },
        required: ['page'],
      },
    },
  },

  // ==========================================
  // KNOWLEDGE & LOOKUP
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'lookup_xactimate_code',
      description: 'Look up information about an Xactimate code including description, typical pricing, and unit of measure.',
      parameters: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The Xactimate code to look up (e.g., RFGDRIP, RFG300, RFGSTEP)',
          },
        },
        required: ['code'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'lookup_irc_code',
      description: 'Look up IRC (International Residential Code) requirements for roofing components.',
      parameters: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            description: 'The roofing component to look up (e.g., drip edge, ice & water shield, starter course)',
          },
        },
        required: ['component'],
      },
    },
  },

  // ==========================================
  // EXPORTS
  // ==========================================
  {
    type: 'function',
    function: {
      name: 'export_document',
      description: 'Export a document to PDF or CSV format.',
      parameters: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            description: 'The project ID',
          },
          documentType: {
            type: 'string',
            enum: ['materials', 'estimate'],
            description: 'The type of document to export',
          },
          format: {
            type: 'string',
            enum: ['pdf', 'csv'],
            description: 'Export format',
          },
        },
        required: ['projectId', 'documentType', 'format'],
      },
    },
  },
]

/**
 * Tool name to human-readable description mapping
 */
export const TOOL_DESCRIPTIONS: Record<string, string> = {
  // Project management
  create_project: 'Creating a new project',
  list_projects: 'Getting your projects',
  get_project_details: 'Loading project details',
  update_project: 'Updating project details',
  
  // File processing
  parse_carrier_scope: 'Parsing carrier scope PDF',
  
  // Document generation (AI-powered)
  generate_delta_analysis: 'Generating Delta Analysis Report',
  generate_cover_letter: 'Creating submission cover letter',
  generate_defense_notes: 'Generating defense notes',
  generate_supplement_letter: 'Creating comprehensive supplement letter',
  generate_rebuttal: 'Drafting rebuttal response',
  generate_project_brief: 'Creating project brief',
  list_documents: 'Loading documents',
  
  // Photos
  analyze_photos: 'Analyzing photos with AI vision',
  
  // Claims
  create_claim: 'Creating insurance claim',
  
  // Navigation
  navigate_to: 'Opening page',
  
  // Knowledge lookup
  lookup_xactimate_code: 'Looking up Xactimate code',
  lookup_irc_code: 'Looking up IRC requirements',
  
  // Export
  export_document: 'Preparing export',
}

export type ToolName = keyof typeof TOOL_DESCRIPTIONS
