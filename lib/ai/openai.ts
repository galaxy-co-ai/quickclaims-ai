import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateOptions {
  temperature?: number // 0.3-1.0
  detailLevel?: 'concise' | 'standard' | 'detailed'
}

export async function generateProjectDocuments(
  projectData: {
    address: string
    clientName: string
    projectType: string
  },
  scopeContent?: string,
  retrievalContext?: string,
  typeGuidance?: string,
  photos?: string[],
  options?: GenerateOptions
) {
  const temperature = options?.temperature ?? 0.7
  const detailLevel = options?.detailLevel ?? 'standard'

  const detailInstructions = {
    concise: 'Keep descriptions brief. Fewer line items, only essential materials and costs.',
    standard: 'Provide a balanced level of detail suitable for professional estimates.',
    detailed: 'Be thorough. Include all sub-tasks, specialty items, and granular cost breakdowns.',
  }[detailLevel]

  const systemPrompt = `You are an expert construction project manager and estimator. You always return strictly valid JSON following the exact schema requested, with no additional commentary. All monetary values must be in USD with numeric values (no currency symbols in numbers). ${detailInstructions}`

  const userPrompt = `
Using the details below, produce four project documents. If scope text is provided, ground your outputs in it and avoid inventing specifics not supported by the scope.

Project Details:
- client: ${projectData.clientName}
- address: ${projectData.address}
- type: ${projectData.projectType}
${scopeContent ? `- scope_text: """\n${scopeContent}\n"""` : ''}
${retrievalContext ? `- retrieval_context: """\n${retrievalContext}\n"""` : ''}
${typeGuidance ? `- type_guidance: ${typeGuidance}` : ''}

Return a single JSON object with these keys and shapes:
{
  "roadmap": {
    "phases": [
      { "name": string, "durationDays": number, "tasks": [string] }
    ],
    "assumptions": [string]
  },
  "materials": {
    "items": [
      { "name": string, "quantity": number, "unit": string, "specs"?: string, "unitPrice"?: number, "totalPrice"?: number }
    ],
    "totalMaterialsCost": number
  },
  "estimate": {
    "currency": "USD",
    "items": [
      {
        "category": string,
        "description": string,
        "quantity": number,
        "unitCost": number,
        "laborBreakdown": [
          { "role": string, "hours": number, "hourlyRate": number, "cost": number }
        ],
        "materialsCost": number,
        "permitFees"?: number,
        "total": number
      }
    ],
    "laborSubtotal": number,
    "materialsSubtotal": number,
    "subtotal": number,
    "taxRate": number,
    "tax": number,
    "grandTotal": number
  },
  "brief": {
    "overview": string,
    "objectives": [string],
    "risks": [string]
  }
}
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature,
  })

  const content = completion.choices[0].message.content
  return content ? JSON.parse(content) : null
}
