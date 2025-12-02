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
  const systemPrompt = `You are an expert construction project manager and estimator. Generate detailed, professional project documents for construction contractors.`

  const userPrompt = `
Generate comprehensive project documents for the following construction project:

**Project Details:**
- Client: ${projectData.clientName}
- Location: ${projectData.address}
- Type: ${projectData.projectType}
${scopeContent ? `\n**Insurance Scope:**\n${scopeContent}` : ''}

Please generate the following documents in JSON format:

1. **Project Roadmap**: A detailed timeline with phases, tasks, and estimated durations
2. **Material List**: Complete list of materials needed with quantities and specifications
3. **Cost Estimate**: Line-item breakdown including labor, materials, permits, and overhead
4. **Project Brief**: Comprehensive project overview serving as the source of truth

Return the response as a JSON object with keys: roadmap, materials, estimate, brief
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
