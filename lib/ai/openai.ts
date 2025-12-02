import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateProjectDocuments(
  projectData: {
    address: string
    clientName: string
    projectType: string
  },
  scopeContent?: string,
  photos?: string[]
) {
  const systemPrompt = `You are an expert construction project manager and estimator. You always return strictly valid JSON following the exact schema requested, with no additional commentary.`

  const userPrompt = `
Using the details below, produce four project documents. If scope text is provided, ground your outputs in it and avoid inventing specifics not supported by the scope.

Project Details:
- client: ${projectData.clientName}
- address: ${projectData.address}
- type: ${projectData.projectType}
${scopeContent ? `- scope_text: """\n${scopeContent}\n"""` : ''}

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
      { "name": string, "quantity": number, "unit": string, "specs"?: string }
    ]
  },
  "estimate": {
    "currency": "USD",
    "items": [
      { "category": string, "description": string, "quantity": number, "unitCost": number, "laborHours"?: number, "permitFees"?: number, "total": number }
    ],
    "subtotal": number,
    "tax"?: number,
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
    temperature: 0.7,
  })

  const content = completion.choices[0].message.content
  return content ? JSON.parse(content) : null
}
