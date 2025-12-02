export function typeGuidance(projectType: string) {
  const t = projectType.toLowerCase()
  if (t.includes('roof')) {
    return 'Focus on roofing best practices: tear-off vs overlay, decking inspection, underlayment (synthetic vs felt), ice & water shield at eaves/valleys, flashing replacement, ventilation (ridge/soffit), shingle type and warranty, disposal and site protection.'
  }
  if (t.includes('water')) {
    return 'Water mitigation and restoration: IICRC S500 categories and classes, moisture mapping, demo/dry-out (air movers, dehumidifiers), anti-microbial application, contents protection, rebuilding scope, permits as applicable.'
  }
  if (t.includes('fire')) {
    return 'Fire and smoke remediation: IICRC S700 principles, structural cleaning vs replacement, deodorization (thermal fog/ozone), electrical/plumbing inspection, safety and permits.'
  }
  if (t.includes('siding')) {
    return 'Siding replacement: material selection (vinyl, fiber cement), weather barriers, flashing details, trim and caulking, painting requirements, waste and site protection.'
  }
  if (t.includes('remodel')) {
    return 'Remodel: obtain plans and permits, structural changes, trades coordination (electrical, plumbing, HVAC), inspections, finish selections, schedule sequencing.'
  }
  if (t.includes('addition')) {
    return 'Home addition: site survey, foundation work, framing tied to existing, roofing tie-in, utilities extension, inspections, energy code compliance, schedule and budget controls.'
  }
  return 'General contracting: safety, permits, material procurement, schedule, quality control, inspections, client communication, and closeout documentation.'
}
