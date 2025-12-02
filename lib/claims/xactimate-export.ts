/**
 * Xactimate Export Format Generator
 * Generates ESX-compatible line items for supplement submissions
 */

import { getXactimateCode, ROOFING_CODES } from './xactimate-codes'

export interface XactimateLineItem {
  lineNumber: number
  category: string
  selector: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  rcv: number
  notes?: string
}

export interface SupplementPackageData {
  claim: {
    claimNumber: string | null
    carrier: string | null
    dateOfLoss: string | null
    policyType: string | null
  }
  insured: {
    name: string
    address: string
  }
  contractor: {
    name: string
    license?: string
    phone?: string
    email?: string
  }
  lineItems: XactimateLineItem[]
  defenseNotes: Array<{
    xactimateCode: string | null
    description: string
    ircCode: string | null
    defenseNote: string
  }>
  photos: Array<{
    id: string
    type: string
    location: string | null
    url: string
  }>
  totalRCV: number
  totalSupplementAmount: number
}

/**
 * Generate an Xactimate-compatible CSV export
 */
export function generateXactimateCSV(lineItems: XactimateLineItem[]): string {
  const headers = [
    'Line',
    'Category',
    'Selector',
    'Description',
    'Quantity',
    'Unit',
    'Unit Price',
    'RCV',
    'Notes'
  ]

  const rows = lineItems.map(item => [
    item.lineNumber.toString(),
    item.category,
    item.selector,
    `"${item.description.replace(/"/g, '""')}"`,
    item.quantity.toFixed(2),
    item.unit,
    item.unitPrice.toFixed(2),
    item.rcv.toFixed(2),
    item.notes ? `"${item.notes.replace(/"/g, '""')}"` : ''
  ])

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

/**
 * Generate supplement line items from approved deltas
 */
export function generateSupplementLineItems(
  deltas: Array<{
    xactimateCode: string | null
    description: string
    quantity: number | null
    unit: string | null
    estimatedRCV: number | null
  }>,
  startingLineNumber: number = 1
): XactimateLineItem[] {
  return deltas.map((delta, index) => {
    const codeRef = delta.xactimateCode ? getXactimateCode(delta.xactimateCode) : null
    
    // Default pricing (would normally come from Xactimate price list)
    const defaultPricing: Record<string, number> = {
      'RFGDRIP': 3.50,
      'RFGSTRT': 4.25,
      'RFGIWS': 2.85,
      'RFGSTEP': 12.50,
      'RFGRIDGCS': 8.75,
      'RFGSTEEP': 35.00, // per SQ
      'RFGHIGH': 25.00, // per SQ
      'RFGSUPR': 45.00, // per hour
      'RFGCRKT': 175.00, // each
      'RFGDECK': 2.25, // per SF
    }

    const unitPrice = delta.xactimateCode 
      ? (defaultPricing[delta.xactimateCode.toUpperCase()] || 0)
      : 0

    const quantity = delta.quantity || 1
    const rcv = delta.estimatedRCV || (unitPrice * quantity)

    return {
      lineNumber: startingLineNumber + index,
      category: codeRef?.category || 'roofing',
      selector: delta.xactimateCode || '',
      description: codeRef?.description || delta.description,
      quantity,
      unit: delta.unit || codeRef?.unit || 'EA',
      unitPrice,
      rcv,
      notes: `Supplement item - ${delta.description}`
    }
  })
}

/**
 * Generate a complete supplement package document
 */
export function generateSupplementDocument(data: SupplementPackageData): string {
  const lines: string[] = []
  
  // Header
  lines.push('=' .repeat(80))
  lines.push('                         SUPPLEMENT REQUEST')
  lines.push('=' .repeat(80))
  lines.push('')
  
  // Claim Info
  lines.push('CLAIM INFORMATION')
  lines.push('-'.repeat(80))
  if (data.claim.carrier) lines.push(`Carrier: ${data.claim.carrier}`)
  if (data.claim.claimNumber) lines.push(`Claim Number: ${data.claim.claimNumber}`)
  if (data.claim.dateOfLoss) lines.push(`Date of Loss: ${data.claim.dateOfLoss}`)
  if (data.claim.policyType) lines.push(`Policy Type: ${data.claim.policyType}`)
  lines.push('')
  
  // Insured Info
  lines.push('INSURED INFORMATION')
  lines.push('-'.repeat(80))
  lines.push(`Name: ${data.insured.name}`)
  lines.push(`Property Address: ${data.insured.address}`)
  lines.push('')
  
  // Contractor Info
  lines.push('CONTRACTOR INFORMATION')
  lines.push('-'.repeat(80))
  lines.push(`Company: ${data.contractor.name}`)
  if (data.contractor.license) lines.push(`License: ${data.contractor.license}`)
  if (data.contractor.phone) lines.push(`Phone: ${data.contractor.phone}`)
  if (data.contractor.email) lines.push(`Email: ${data.contractor.email}`)
  lines.push('')
  
  // Summary
  lines.push('SUPPLEMENT SUMMARY')
  lines.push('-'.repeat(80))
  lines.push(`Total Items Requested: ${data.lineItems.length}`)
  lines.push(`Total Supplement RCV: $${data.totalSupplementAmount.toLocaleString()}`)
  lines.push(`Original Carrier RCV: $${data.totalRCV.toLocaleString()}`)
  lines.push(`New Total RCV: $${(data.totalRCV + data.totalSupplementAmount).toLocaleString()}`)
  lines.push('')
  
  // Line Items
  lines.push('=' .repeat(80))
  lines.push('                       SUPPLEMENT LINE ITEMS')
  lines.push('=' .repeat(80))
  lines.push('')
  
  // Table header
  lines.push(
    'Line'.padEnd(6) +
    'Code'.padEnd(12) +
    'Description'.padEnd(40) +
    'Qty'.padStart(8) +
    'Unit'.padStart(6) +
    'RCV'.padStart(12)
  )
  lines.push('-'.repeat(84))
  
  // Line items
  data.lineItems.forEach(item => {
    lines.push(
      item.lineNumber.toString().padEnd(6) +
      (item.selector || '-').padEnd(12) +
      item.description.slice(0, 38).padEnd(40) +
      item.quantity.toFixed(2).padStart(8) +
      item.unit.padStart(6) +
      `$${item.rcv.toFixed(0)}`.padStart(12)
    )
  })
  
  lines.push('-'.repeat(84))
  lines.push(
    ''.padEnd(66) +
    'TOTAL:'.padStart(6) +
    `$${data.totalSupplementAmount.toFixed(0)}`.padStart(12)
  )
  lines.push('')
  
  // Defense Notes
  if (data.defenseNotes.length > 0) {
    lines.push('=' .repeat(80))
    lines.push('                       DETAILED JUSTIFICATIONS')
    lines.push('=' .repeat(80))
    lines.push('')
    
    data.defenseNotes.forEach((note, i) => {
      lines.push(`${i + 1}. ${note.description}`)
      if (note.xactimateCode) lines.push(`   Xactimate Code: ${note.xactimateCode}`)
      if (note.ircCode) lines.push(`   Code Reference: IRC ${note.ircCode}`)
      lines.push('')
      lines.push(note.defenseNote.split('\n').map(l => '   ' + l).join('\n'))
      lines.push('')
      lines.push('-'.repeat(80))
      lines.push('')
    })
  }
  
  // Photo Documentation
  if (data.photos.length > 0) {
    lines.push('=' .repeat(80))
    lines.push('                       PHOTO DOCUMENTATION')
    lines.push('=' .repeat(80))
    lines.push('')
    lines.push(`${data.photos.length} photos attached to this supplement request.`)
    lines.push('')
    
    data.photos.forEach((photo, i) => {
      lines.push(`${i + 1}. ${photo.type}${photo.location ? ` - ${photo.location}` : ''}`)
    })
    lines.push('')
  }
  
  // Footer
  lines.push('=' .repeat(80))
  lines.push('This supplement request has been prepared with reference to the')
  lines.push('International Residential Code (IRC) and manufacturer specifications.')
  lines.push('')
  lines.push(`Date Prepared: ${new Date().toLocaleDateString()}`)
  lines.push('=' .repeat(80))
  
  return lines.join('\n')
}

/**
 * Generate photo index/binder content
 */
export function generatePhotoBinder(
  photos: Array<{
    id: string
    type: string
    location: string | null
    url: string
    analysis?: {
      components: Array<{ component: string; present: boolean }>
      damage: Array<{ damageType: string; severity: string }>
    }
  }>
): string {
  const lines: string[] = []
  
  lines.push('=' .repeat(60))
  lines.push('           PHOTO DOCUMENTATION INDEX')
  lines.push('=' .repeat(60))
  lines.push('')
  lines.push(`Total Photos: ${photos.length}`)
  lines.push(`Date: ${new Date().toLocaleDateString()}`)
  lines.push('')
  
  // Group by type
  const grouped = photos.reduce((acc, photo) => {
    if (!acc[photo.type]) acc[photo.type] = []
    acc[photo.type].push(photo)
    return acc
  }, {} as Record<string, typeof photos>)
  
  Object.entries(grouped).forEach(([type, typePhotos]) => {
    lines.push('-'.repeat(60))
    lines.push(`${type.toUpperCase()} PHOTOS (${typePhotos.length})`)
    lines.push('-'.repeat(60))
    lines.push('')
    
    typePhotos.forEach((photo, i) => {
      lines.push(`Photo ${i + 1}:`)
      if (photo.location) lines.push(`  Location: ${photo.location}`)
      
      if (photo.analysis) {
        const presentComponents = photo.analysis.components.filter(c => c.present)
        if (presentComponents.length > 0) {
          lines.push(`  Components: ${presentComponents.map(c => c.component).join(', ')}`)
        }
        if (photo.analysis.damage.length > 0) {
          lines.push(`  Damage: ${photo.analysis.damage.map(d => `${d.damageType} (${d.severity})`).join(', ')}`)
        }
      }
      lines.push('')
    })
  })
  
  return lines.join('\n')
}

/**
 * Validate supplement package completeness
 */
export function validateSupplementPackage(data: Partial<SupplementPackageData>): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Required fields
  if (!data.claim?.claimNumber) errors.push('Claim number is required')
  if (!data.insured?.name) errors.push('Insured name is required')
  if (!data.insured?.address) errors.push('Property address is required')
  if (!data.lineItems || data.lineItems.length === 0) errors.push('At least one line item is required')
  
  // Warnings
  if (!data.claim?.carrier) warnings.push('Carrier name not specified')
  if (!data.defenseNotes || data.defenseNotes.length === 0) {
    warnings.push('No defense notes included - supplement may be denied')
  }
  if (!data.photos || data.photos.length === 0) {
    warnings.push('No photos attached - photo documentation recommended')
  }
  
  // Check for IRC codes on line items
  const itemsWithoutIRC = data.lineItems?.filter(
    item => !data.defenseNotes?.some(n => n.xactimateCode === item.selector && n.ircCode)
  )
  if (itemsWithoutIRC && itemsWithoutIRC.length > 0) {
    warnings.push(`${itemsWithoutIRC.length} items without IRC code references`)
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}
