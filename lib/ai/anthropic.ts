import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Generate a professional defense note for a supplement item
 * Claude excels at persuasive, nuanced writing
 */
export async function generateDefenseNote(params: {
  itemDescription: string
  xactimateCode?: string
  ircCode?: string
  photoEvidence?: string
  carrierName?: string
  claimContext?: string
}): Promise<string> {
  const { itemDescription, xactimateCode, ircCode, photoEvidence, carrierName, claimContext } = params

  const systemPrompt = `You are an expert insurance claims consultant specializing in roofing and restoration. 
Your task is to write compelling, professional defense notes that justify supplement items to insurance adjusters.

Your defense notes should:
- Be professional and factual, not confrontational
- Reference IRC codes when applicable
- Explain WHY the item is necessary, not just that it is
- Address common adjuster objections preemptively
- Be concise but thorough (2-4 paragraphs)
- Use industry-standard terminology

Remember: Your goal is to help the contractor get fair payment for legitimate work, not to game the system.`

  const userPrompt = `Write a professional defense note for this supplement item:

ITEM: ${itemDescription}
${xactimateCode ? `XACTIMATE CODE: ${xactimateCode}` : ''}
${ircCode ? `IRC CODE REFERENCE: ${ircCode}` : ''}
${photoEvidence ? `PHOTO EVIDENCE: ${photoEvidence}` : ''}
${carrierName ? `CARRIER: ${carrierName}` : ''}
${claimContext ? `CLAIM CONTEXT: ${claimContext}` : ''}

Write a defense note that justifies why this item should be included in the carrier's scope. Be persuasive but professional.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: userPrompt }
    ],
    system: systemPrompt,
  })

  // Extract text from response
  const textContent = message.content.find(block => block.type === 'text')
  return textContent?.type === 'text' ? textContent.text : ''
}

/**
 * Generate a full supplement letter/document
 */
export async function generateSupplementLetter(params: {
  insuredName: string
  propertyAddress: string
  claimNumber?: string
  carrierName: string
  adjusterName?: string
  dateOfLoss?: string
  items: Array<{
    description: string
    xactimateCode?: string
    quantity?: number
    unit?: string
    rcv?: number
    defenseNote?: string
  }>
  totalSupplementAmount: number
  originalRCV: number
}): Promise<string> {
  const { insuredName, propertyAddress, claimNumber, carrierName, adjusterName, dateOfLoss, items, totalSupplementAmount, originalRCV } = params

  const systemPrompt = `You are an expert insurance claims consultant. Write professional supplement letters that are:
- Courteous but firm
- Well-organized with clear sections
- Backed by code references and documentation
- Focused on the facts and merits of each item

Format the letter professionally with:
- Header with date and claim information
- Introduction explaining the purpose
- Itemized list of supplement items with justifications
- Summary of total amounts
- Professional closing`

  const itemsList = items.map((item, i) => 
    `${i + 1}. ${item.description}${item.xactimateCode ? ` (${item.xactimateCode})` : ''}
   ${item.quantity && item.unit ? `Quantity: ${item.quantity} ${item.unit}` : ''}
   ${item.rcv ? `RCV: $${item.rcv.toFixed(2)}` : ''}
   ${item.defenseNote ? `Justification: ${item.defenseNote}` : ''}`
  ).join('\n\n')

  const userPrompt = `Write a professional supplement letter with the following information:

INSURED: ${insuredName}
PROPERTY: ${propertyAddress}
${claimNumber ? `CLAIM #: ${claimNumber}` : ''}
CARRIER: ${carrierName}
${adjusterName ? `ADJUSTER: ${adjusterName}` : ''}
${dateOfLoss ? `DATE OF LOSS: ${dateOfLoss}` : ''}

ORIGINAL RCV: $${originalRCV.toLocaleString()}
SUPPLEMENT AMOUNT: $${totalSupplementAmount.toLocaleString()}
NEW TOTAL RCV: $${(originalRCV + totalSupplementAmount).toLocaleString()}

SUPPLEMENT ITEMS:
${itemsList}

Write a professional letter requesting these supplement items be added to the claim. Include appropriate IRC code references where relevant.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      { role: 'user', content: userPrompt }
    ],
    system: systemPrompt,
  })

  const textContent = message.content.find(block => block.type === 'text')
  return textContent?.type === 'text' ? textContent.text : ''
}

/**
 * Generate a rebuttal for a denied supplement item
 */
export async function generateRebuttal(params: {
  itemDescription: string
  denialReason: string
  xactimateCode?: string
  ircCode?: string
  photoEvidence?: string
  additionalContext?: string
}): Promise<string> {
  const { itemDescription, denialReason, xactimateCode, ircCode, photoEvidence, additionalContext } = params

  const systemPrompt = `You are an expert insurance claims consultant specializing in supplement rebuttals.
Your task is to write professional, persuasive rebuttals that address the specific denial reasons.

Your rebuttals should:
- Directly address each point in the denial
- Provide factual counter-arguments
- Reference IRC codes and industry standards
- Remain professional and non-confrontational
- Suggest a path forward for resolution
- Be thorough but focused (3-5 paragraphs)`

  const userPrompt = `Write a professional rebuttal for this denied supplement item:

ITEM: ${itemDescription}
${xactimateCode ? `XACTIMATE CODE: ${xactimateCode}` : ''}
${ircCode ? `IRC CODE: ${ircCode}` : ''}

DENIAL REASON: ${denialReason}

${photoEvidence ? `PHOTO EVIDENCE AVAILABLE: ${photoEvidence}` : ''}
${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

Write a rebuttal that professionally addresses the denial reason and makes a case for including this item.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [
      { role: 'user', content: userPrompt }
    ],
    system: systemPrompt,
  })

  const textContent = message.content.find(block => block.type === 'text')
  return textContent?.type === 'text' ? textContent.text : ''
}
