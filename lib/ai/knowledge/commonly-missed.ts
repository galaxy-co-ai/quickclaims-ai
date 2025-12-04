/**
 * Commonly Missed Items Reference
 * 
 * These are items that insurance carriers frequently omit from their scopes.
 * The AI uses this to proactively identify missing items during delta analysis.
 */

export interface MissedItemTemplate {
  code: string
  name: string
  category: string
  ircCode: string | null
  reason: string
  defenseNote: string
  photoEvidence: string[]
  typicalQuantitySource: string
  priority: 'critical' | 'high' | 'medium'
}

export const COMMONLY_MISSED_ITEMS: MissedItemTemplate[] = [
  // ==========================================
  // CRITICAL - Code Required
  // ==========================================
  {
    code: 'RFGDRIP',
    name: 'Drip Edge',
    category: 'edges',
    ircCode: 'R905.2.8.5',
    reason: 'REQUIRED by code at eaves and rake edges - carriers often omit entirely',
    defenseNote: 'Drip edge is REQUIRED per IRC R905.2.8.5 at ALL eaves and rake edges of shingle roofs. This is a CODE REQUIREMENT, not optional. The code states: "A drip edge shall be provided at eaves and rake edges of shingle roofs. Adjacent segments of drip edge shall be overlapped a minimum of 2 inches." Measurement report confirms total eave + rake linear footage.',
    photoEvidence: ['Edge of roof photo showing existing/missing drip edge', 'Eave close-up', 'Rake close-up'],
    typicalQuantitySource: 'Eaves LF + Rakes LF from EagleView/Hover report',
    priority: 'critical'
  },
  {
    code: 'RFGASTR',
    name: 'Starter Course',
    category: 'starter',
    ircCode: 'R905.2.8.1',
    reason: 'Required per code - NOT included in waste calculations',
    defenseNote: 'Starter strip shingles REQUIRED per IRC R905.2.8.1 at ALL roof eaves: "Starter strip shingles, or the equivalent, shall be applied at all roof eaves." EagleView measurement report confirms this is NOT included in shingle waste calculation and must be added as a separate line item. Must use proper Xactimate line item (not waste).',
    photoEvidence: ['Edge of roof showing starter course installation point'],
    typicalQuantitySource: 'Total eaves LF + rakes LF from measurement report',
    priority: 'critical'
  },
  {
    code: 'RFGIWS',
    name: 'Ice & Water Shield',
    category: 'underlayment',
    ircCode: 'R905.2.7.1',
    reason: 'Required in valleys and at eaves per code and manufacturer instructions',
    defenseNote: 'Ice & water shield membrane required per IRC R905.2.7.1 which states ice barrier is required "in areas where there has been a history of ice forming along the eaves causing a backup of water." Additionally, manufacturer installation instructions require IWS in all valleys. Valley application requires minimum 36" wide IWS per IRC R905.2.8.2. Must extend from eaves to point at least 24" inside exterior wall line.',
    photoEvidence: ['Valley photos', 'Eave photos showing IWS installation area'],
    typicalQuantitySource: 'Valley LF × 3 ft width + Eaves LF × 2 ft width',
    priority: 'critical'
  },
  {
    code: 'RFGSTEP',
    name: 'Step Flashing',
    category: 'flashing',
    ircCode: 'R905.2.8.3',
    reason: 'Required at all roof-to-wall intersections',
    defenseNote: 'Step flashing REQUIRED per IRC R905.2.8.3 at all roof-to-wall intersections: "Where vertical surfaces intersect a sloping roof plane, step flashing shall be used. Each step flashing shall be a minimum of 4 inches by 4 inches." Existing flashing that is pried, bent, or damaged during tear-off must be replaced per IRC R908.5.',
    photoEvidence: ['Wall-to-roof intersection photos', 'Chimney step flashing', 'Dormer sidewall flashing'],
    typicalQuantitySource: 'Measure all wall intersections from photos/measurements',
    priority: 'critical'
  },
  {
    code: 'RFGRIDGC',
    name: 'Hip/Ridge Cap',
    category: 'ridge',
    ircCode: null,
    reason: 'NOT included in EagleView waste calculation - must be separate line item',
    defenseNote: 'Hip and ridge cap shingles are NOT included in the EagleView/measurement waste calculation and must be added as a separate line item. This is confirmed in EagleView reports which state waste does not include hip/ridge cap material. Total hip + ridge linear footage from measurement report must be added.',
    photoEvidence: ['Ridge line photos', 'Hip line photos'],
    typicalQuantitySource: 'Ridge LF + Hips LF from measurement report',
    priority: 'critical'
  },

  // ==========================================
  // HIGH PRIORITY - Safety & Labor
  // ==========================================
  {
    code: 'RFGSTEEP',
    name: 'Steep Pitch Charges',
    category: 'steep',
    ircCode: null,
    reason: 'Additional labor required for pitches 7/12 and above',
    defenseNote: 'Roof slope documented at [X]/12 as shown in photos and measurement report. Steep pitch charge required for slopes 7/12 to 9/12 per industry standards due to additional labor, safety equipment, and reduced productivity. Workers cannot safely walk on slopes above 7/12 without additional safety measures.',
    photoEvidence: ['Pitch gauge photo', 'Overview showing roof steepness', 'Measurement report pitch data'],
    typicalQuantitySource: 'Total roof squares from measurement report',
    priority: 'high'
  },
  {
    code: 'RFGHIGH+',
    name: 'Two-Story/High Charges',
    category: 'steep',
    ircCode: 'OSHA',
    reason: 'OSHA requires additional safety measures for heights; carriers often omit',
    defenseNote: 'Two-story or higher structure requires additional labor for material handling and safety per OSHA requirements. Workers must use fall protection and specialized equipment for heights over one story. Photos document [2/3]-story structure requiring high roof charge.',
    photoEvidence: ['Ground-level elevation photos showing building height', 'All four elevations'],
    typicalQuantitySource: 'Total roof squares from measurement report',
    priority: 'high'
  },
  {
    code: 'RFGSUPR',
    name: 'Supervisor Hours',
    category: 'labor',
    ircCode: 'OSHA',
    reason: 'OSHA requires supervision for steep or 2+ story work',
    defenseNote: 'OSHA requires supervision for roofing work on 2+ story structures or steep pitches exceeding 5/12. Project supervision/project management hours required for safety compliance and crew coordination. Cannot have multiple crew members working at heights without designated supervisor.',
    photoEvidence: ['Photos showing height/steepness requiring supervision'],
    typicalQuantitySource: 'Estimate 8-16 hours based on job size',
    priority: 'high'
  },

  // ==========================================
  // HIGH PRIORITY - Structural
  // ==========================================
  {
    code: 'RFGCRKT',
    name: 'Cricket/Saddle',
    category: 'flashing',
    ircCode: 'R903.2.2',
    reason: 'Required for chimneys/penetrations over 30" wide - frequently omitted',
    defenseNote: 'Cricket/saddle REQUIRED per IRC R903.2.2 which states: "A cricket or saddle shall be installed on the ridge side of any chimney or penetration more than 30 inches wide as measured perpendicular to the slope." Photos and measurements confirm chimney width exceeds 30". Existing metal cricket shows storm damage and will be further damaged during tear-off; replacement necessary.',
    photoEvidence: ['Chimney with measurement showing width', 'Cricket current condition'],
    typicalQuantitySource: '1 EA per qualifying chimney/penetration',
    priority: 'high'
  },
  {
    code: 'RFGDECK',
    name: 'Decking Replacement',
    category: 'decking',
    ircCode: 'R905.2.1',
    reason: 'Often needed but carriers resist - requires attic inspection proof',
    defenseNote: 'Decking replacement required per IRC R905.2.1 which mandates shingles be fastened to solidly sheathed decks. Photos from attic inspection document [damaged/water-soaked/spaced/deteriorated] decking that does not meet code requirements. Per IRC R908.3.1.1, roof recover not permitted over water-soaked or deteriorated decking.',
    photoEvidence: ['Attic photos showing decking condition', 'Water stains', 'Rot', 'Spacing issues'],
    typicalQuantitySource: 'Estimate SF from attic inspection - typically 10-20% of total',
    priority: 'high'
  },
  {
    code: 'RFGVMTLW',
    name: 'Valley Metal (W-Profile)',
    category: 'valley',
    ircCode: 'R905.2.8.2',
    reason: 'Required for open valleys; LKQ replacement needed',
    defenseNote: 'W-profile valley metal required per IRC R905.2.8.2 to maintain Like, Kind, and Quality (LKQ). Valley linings shall be installed per manufacturer instructions. Open valleys require minimum 24" wide valley lining. Existing W-valley metal must be replaced to maintain LKQ construction and watertight assembly.',
    photoEvidence: ['Valley photos showing W-profile metal', 'Valley intersection photos'],
    typicalQuantitySource: 'Valley LF from measurement report',
    priority: 'high'
  },

  // ==========================================
  // MEDIUM PRIORITY - Site & Protection
  // ==========================================
  {
    code: 'RFGDUMP',
    name: 'Debris Removal/Dumpster',
    category: 'site',
    ircCode: null,
    reason: 'Cannot do partial haul-off - full unit required',
    defenseNote: 'Updated to 1.0 units; haul-off cannot be partial. Debris removal and disposal is required for tear-off operations. Dumpster/haul-off cannot be prorated - must include full removal and disposal costs.',
    photoEvidence: ['Overview photos showing tear-off scope'],
    typicalQuantitySource: '1-2 EA based on squares (typically 1 per 20 squares)',
    priority: 'medium'
  },
  {
    code: 'RFGTARP',
    name: 'Ground Tarping/Protection',
    category: 'site',
    ircCode: null,
    reason: 'Required for property protection during tear-off',
    defenseNote: 'Perimeter ground tarping required for property protection during tear-off. Landscaping, driveway, and property at risk from debris. Request up front when steepness/complexity and landscaping are documented. This protects property during construction and prevents homeowner damage claims.',
    photoEvidence: ['Ground-level photos showing landscaping', 'Manicured lawn', 'Gardens', 'Driveway'],
    typicalQuantitySource: 'Perimeter LF of work area',
    priority: 'medium'
  },
  {
    code: 'RFGSAT',
    name: 'Satellite Detach & Reset',
    category: 'detach-reset',
    ircCode: null,
    reason: 'Cannot roof through - must detach and reset',
    defenseNote: 'Satellite dish must be detached and reset to complete roofing work. Cannot roof through or around existing installation without detachment. Photos document satellite dish requiring D&R.',
    photoEvidence: ['Roof photos showing satellite dish location'],
    typicalQuantitySource: '1 EA per dish',
    priority: 'medium'
  },
  {
    code: 'GTRDR',
    name: 'Gutter Detach & Reset',
    category: 'detach-reset',
    ircCode: null,
    reason: 'Required for proper drip edge installation',
    defenseNote: 'Gutters must be detached and reset for proper drip edge installation per IRC R905.2.8.5. Drip edge must extend 1/4" below sheathing and install behind gutter. Cannot install code-compliant drip edge without gutter D&R.',
    photoEvidence: ['Eave photos showing gutter installation'],
    typicalQuantitySource: 'Gutter LF from photos/measurements',
    priority: 'medium'
  },

  // ==========================================
  // MEDIUM PRIORITY - Ventilation
  // ==========================================
  {
    code: 'RFGVENTA',
    name: 'Ridge Vent',
    category: 'ventilation',
    ircCode: 'R806.2',
    reason: 'Often omitted or under-scoped; requires NFA calculation',
    defenseNote: 'Ridge vent required to maintain proper attic ventilation per IRC R806.2. Ventilation area must be 1/150 of vented attic space (1/300 with vapor retarder). NFA calculation: Attic SF ÷ 150 = minimum ventilation sq in required. Current scope provides insufficient ventilation.',
    photoEvidence: ['Ridge line photos', 'Attic photos showing ventilation'],
    typicalQuantitySource: 'Ridge LF from measurement report',
    priority: 'medium'
  },
  {
    code: 'RFGFLPJSB',
    name: 'Split Boot (Pipe Jack)',
    category: 'flashing',
    ircCode: null,
    reason: 'Required for electrical mast - cannot remove/reset without split boot',
    defenseNote: 'Split boot required for electrical mast penetration. Cannot remove and reset electrical mast without split boot. Standard pipe jack will not work for electrical mast installations. Photo documents electrical mast requiring split boot flashing.',
    photoEvidence: ['Electrical mast penetration photos'],
    typicalQuantitySource: '1 EA per electrical mast',
    priority: 'medium'
  },

  // ==========================================
  // ADDITIONAL FLASHING ITEMS
  // ==========================================
  {
    code: 'RFGFLCH',
    name: 'Chimney Flashing Package',
    category: 'flashing',
    ircCode: 'R905.2.8',
    reason: 'Complete package often omitted - carriers only pay for partial',
    defenseNote: 'Complete chimney flashing package required per IRC R905.2.8 including base flashing, step flashing, and counter flashing. Base and step flashing are integrated with shingle courses and cannot be removed without damage per IRC R908.5. Photos document chimney size [X]" x [X]" requiring [average/large] flashing package.',
    photoEvidence: ['Chimney overview with measurements', 'Close-up of current flashing condition', 'Step flashing at chimney sides'],
    typicalQuantitySource: '1 EA per chimney - size determines small/average/large',
    priority: 'high'
  },
  {
    code: 'RFGCNTFL',
    name: 'Counter Flashing',
    category: 'flashing',
    ircCode: 'R905.2.8',
    reason: 'Required over step flashing at masonry walls',
    defenseNote: 'Counter flashing required over step flashing at masonry walls per IRC R905.2.8 and manufacturer installation instructions. Counter flashing must be installed into mortar joints or reglet to provide weathertight assembly. Replace to maintain LKQ. Photos document masonry wall requiring counter flashing.',
    photoEvidence: ['Masonry wall-to-roof intersection', 'Existing counter flashing condition'],
    typicalQuantitySource: 'Wall intersection LF at masonry surfaces',
    priority: 'high'
  },
  {
    code: 'RFGFL20',
    name: 'Transition Flashing (20")',
    category: 'flashing',
    ircCode: null,
    reason: 'Required at shingle-to-flat roof transitions',
    defenseNote: '20" wide flashing required for watertight shingle-to-flat roof transition. Standard 14" flashing insufficient for proper coverage at pitch transitions. Must provide adequate overlap on both roof surfaces for weathertight assembly.',
    photoEvidence: ['Transition area photos', 'Close-up of pitch change'],
    typicalQuantitySource: 'Transition LF from photos/measurements',
    priority: 'high'
  },
  {
    code: 'RFGLFL',
    name: 'L-Flashing / Headwall Flashing',
    category: 'flashing',
    ircCode: 'R905.2.8',
    reason: 'Required at horizontal wall-to-roof intersections',
    defenseNote: 'L-flashing required at headwall (horizontal roof-to-wall) intersections per IRC R905.2.8. Unlike step flashing at sidewalls, headwall flashing runs continuously along the wall. Must extend minimum 4" up wall and 4" onto roof surface. Photos document headwall intersection at [X] LF.',
    photoEvidence: ['Headwall intersection photos', 'Current flashing condition'],
    typicalQuantitySource: 'Headwall LF from photos/measurements',
    priority: 'high'
  },
  {
    code: 'RFGFLRD',
    name: 'Rain Diverter',
    category: 'flashing',
    ircCode: null,
    reason: 'Required above doors/windows in roof runoff path',
    defenseNote: 'Rain diverter required above entry doors and windows located in roof water runoff path. Protects entryways from water cascade during rain events. Photos document entry location below roof edge requiring rain diverter for property protection.',
    photoEvidence: ['Door/window below roofline', 'Water flow path from roof'],
    typicalQuantitySource: '1 EA per door/window requiring protection',
    priority: 'medium'
  },

  // ==========================================
  // ADDITIONAL VENTILATION ITEMS
  // ==========================================
  {
    code: 'RFGVENTT',
    name: 'Box/Turtle Vents',
    category: 'ventilation',
    ircCode: 'R806.2',
    reason: 'Existing vents must be replaced - cannot reuse',
    defenseNote: 'Existing box/turtle vents cannot be reused during reroof. Vent flanges are secured under shingles and integrated with underlayment. Removal during tear-off damages flanges and sealant. Replacement required to maintain NFA ventilation per IRC R806.2. Photos document [X] existing box vents requiring replacement.',
    photoEvidence: ['Existing vent photos', 'Close-up showing flange condition'],
    typicalQuantitySource: 'Count existing vents from photos',
    priority: 'medium'
  },
  {
    code: 'RFGPAV',
    name: 'Power Attic Vent',
    category: 'ventilation',
    ircCode: 'R806.2',
    reason: 'Flashing nails caulked - damage during tear-off requires replacement',
    defenseNote: 'Power attic vent flashing is secured with caulked nails integrated with shingle courses. Removal during tear-off damages flashing and electrical connections. Full replacement required to maintain weathertight seal and proper ventilation per IRC R806.2.',
    photoEvidence: ['Power vent location photos', 'Flashing condition'],
    typicalQuantitySource: '1 EA per power vent',
    priority: 'medium'
  },
  {
    code: 'RFGVENTB',
    name: 'Turbine Vent',
    category: 'ventilation',
    ircCode: 'R806.2',
    reason: 'Cannot be removed and reinstalled - bearings and flashing damaged',
    defenseNote: 'Turbine vent bearings and flashing are damaged during removal. Turbine assembly cannot be safely removed and reinstalled. Base flashing is integrated with shingles and damaged during tear-off. Replacement required to maintain proper exhaust ventilation per IRC R806.2.',
    photoEvidence: ['Turbine vent photos', 'Current condition'],
    typicalQuantitySource: '1 EA per turbine vent',
    priority: 'medium'
  },
  {
    code: 'RFGVENTE',
    name: 'Exhaust Cap (6"-8")',
    category: 'ventilation',
    ircCode: null,
    reason: 'HVAC/bath exhaust caps must be replaced with reroof',
    defenseNote: 'Exhaust caps for bathroom fans, range hoods, and dryer vents must be replaced during reroof. Flanges are integrated with shingle courses and damaged during tear-off. Cannot maintain weathertight seal with removed/reinstalled caps. Photos document [X] exhaust caps requiring replacement.',
    photoEvidence: ['Exhaust cap photos on roof', 'Cap size/type identification'],
    typicalQuantitySource: 'Count exhaust caps from photos - identify size',
    priority: 'medium'
  },

  // ==========================================
  // PIPE JACK / BOOT ITEMS
  // ==========================================
  {
    code: 'RFGFLPIPE',
    name: 'Pipe Jack / Plumbing Boot',
    category: 'flashing',
    ircCode: null,
    reason: 'All pipe jacks must be replaced - rubber boot degraded',
    defenseNote: 'All plumbing vent pipe jacks must be replaced during reroof. Rubber boots deteriorate with age and UV exposure. Flashing base is integrated with shingles and cannot be removed without damage. Replacement ensures weathertight seal around all plumbing penetrations. Photos document [X] pipe jacks requiring replacement.',
    photoEvidence: ['Pipe jack photos showing quantity and condition', 'Boot condition close-ups'],
    typicalQuantitySource: 'Count all plumbing vents from roof photos',
    priority: 'high'
  },
  {
    code: 'RFGFLPIPEL',
    name: 'Lead Pipe Jack',
    category: 'flashing',
    ircCode: null,
    reason: 'Premium lead boots required for LKQ in some installations',
    defenseNote: 'Lead pipe jacks required to maintain Like Kind and Quality (LKQ) where existing installation used lead boots. Lead provides superior durability and longer lifespan than rubber. Photos document existing lead pipe jacks requiring LKQ replacement.',
    photoEvidence: ['Existing lead pipe jack photos'],
    typicalQuantitySource: 'Count lead boots from inspection photos',
    priority: 'medium'
  },

  // ==========================================
  // ADDITIONAL DETACH & RESET ITEMS
  // ==========================================
  {
    code: 'RFGSOLAR',
    name: 'Solar Panel Detach & Reset',
    category: 'detach-reset',
    ircCode: null,
    reason: 'Solar panels must be removed for complete reroof',
    defenseNote: 'Solar panel array must be detached and reset for complete roof replacement. Cannot properly install underlayment, flashing, and shingles around mounted panels. Requires licensed electrician for disconnection/reconnection. Racking system must be reinstalled with new flashing. Photos document solar array requiring D&R.',
    photoEvidence: ['Solar panel array photos', 'Racking/mounting system'],
    typicalQuantitySource: 'Square footage of panel coverage or panel count',
    priority: 'high'
  },
  {
    code: 'RFGANTENNA',
    name: 'Antenna Detach & Reset',
    category: 'detach-reset',
    ircCode: null,
    reason: 'TV antennas and mounts must be removed for reroof',
    defenseNote: 'TV antenna and mounting hardware must be detached and reset for reroof. Mount base penetrates roof and requires new flashing/seal upon reinstallation. Photos document antenna requiring D&R.',
    photoEvidence: ['Antenna location photos', 'Mounting hardware'],
    typicalQuantitySource: '1 EA per antenna assembly',
    priority: 'medium'
  },
  {
    code: 'RFGLIGHTNING',
    name: 'Lightning Rod Detach & Reset',
    category: 'detach-reset',
    ircCode: null,
    reason: 'Lightning protection system must be removed for reroof',
    defenseNote: 'Lightning rod and associated cabling must be detached and reset for reroof. System is integrated with roof surface and requires professional reinstallation. Photos document lightning protection system requiring D&R.',
    photoEvidence: ['Lightning rod photos', 'Cable routing on roof'],
    typicalQuantitySource: '1 EA per rod plus cable LF',
    priority: 'medium'
  },
  {
    code: 'RFGSKYLRS',
    name: 'Skylight Detach & Reset / Reflash',
    category: 'detach-reset',
    ircCode: null,
    reason: 'Skylight flashing must be replaced with new roof',
    defenseNote: 'Skylight flashing kit must be replaced during reroof. Factory flashing systems are integrated with shingles and cannot be reused. Replacement flashing kit required to maintain weathertight seal. Some skylights require full D&R if seal is compromised. Photos document skylight requiring reflash/D&R.',
    photoEvidence: ['Skylight photos', 'Flashing condition'],
    typicalQuantitySource: '1 EA per skylight',
    priority: 'high'
  },

  // ==========================================
  // ADDITIONAL LABOR ITEMS
  // ==========================================
  {
    code: 'LABRFG',
    name: 'Additional Roofer Hours',
    category: 'labor',
    ircCode: null,
    reason: 'Extra labor for complex conditions not in base pricing',
    defenseNote: 'Additional roofer hours required for [specific condition - e.g., working safely around electrical mast, limited access areas, complex roof geometry, dormers, multiple penetrations, etc.]. Base shingle pricing does not include time for these conditions. [X] additional hours at standard roofer rate.',
    photoEvidence: ['Photos documenting complexity', 'Access restrictions', 'Safety requirements'],
    typicalQuantitySource: 'Estimate hours based on specific conditions',
    priority: 'medium'
  },
  {
    code: 'RFGLADDER',
    name: 'Ladder Work Hours',
    category: 'labor',
    ircCode: null,
    reason: 'Additional time for work requiring ladder access',
    defenseNote: 'Additional labor hours for areas requiring ladder work rather than walking roof surface. Gable cornice areas, restricted access sections, and areas where workers cannot safely walk require ladder setup and repositioning. Additional time for reduced productivity in these conditions.',
    photoEvidence: ['Photos showing access-restricted areas', 'Gable cornice areas'],
    typicalQuantitySource: 'Estimate hours based on access conditions',
    priority: 'medium'
  },

  // ==========================================
  // SITE PROTECTION ITEMS
  // ==========================================
  {
    code: 'RFGPOOLTARP',
    name: 'Pool Tarping/Protection',
    category: 'site',
    ircCode: null,
    reason: 'Pool requires protection during roofing work - nearly 100% approval when documented',
    defenseNote: 'Pool tarping required to prevent debris contamination during tear-off. Roofing debris in pool water causes filter damage, staining, and water chemistry issues. Protection required when pool is in debris fall zone. Photos document pool location requiring tarping during construction.',
    photoEvidence: ['Pool proximity to work area', 'Debris fall path'],
    typicalQuantitySource: 'Pool surface area SF',
    priority: 'medium'
  },
  {
    code: 'RFGPERMIT',
    name: 'Roofing Permit',
    category: 'site',
    ircCode: null,
    reason: 'Required by most jurisdictions - carriers sometimes dispute',
    defenseNote: 'Roofing permit required per [City/County] Building Department for roof replacement projects. Permit ensures code compliance inspection and protects homeowner. Permit fee approximately $[X] based on local fee schedule. This is a legitimate cost of code-compliant roof replacement.',
    photoEvidence: ['Local permit requirements documentation'],
    typicalQuantitySource: '1 EA - verify local permit fee',
    priority: 'medium'
  },
  {
    code: 'RFGPUSU',
    name: 'Pickup/Setup (PU/SU)',
    category: 'site',
    ircCode: null,
    reason: 'Daily setup and cleanup costs not in line item pricing',
    defenseNote: 'Pickup and setup charges cover daily staging of materials, safety equipment setup, ladder/scaffolding positioning, end-of-day cleanup, and material protection. These costs are not included in per-square shingle pricing. Industry standard charge for project setup and daily operations.',
    photoEvidence: ['Site photos showing staging requirements'],
    typicalQuantitySource: '1 EA or daily rate based on project duration',
    priority: 'medium'
  },

  // ==========================================
  // DECKING & STRUCTURAL ITEMS
  // ==========================================
  {
    code: 'RFGSHW5/8',
    name: 'OSB Sheathing (5/8")',
    category: 'decking',
    ircCode: 'R803.1',
    reason: 'Minimum thickness for 24" rafter spacing per code',
    defenseNote: 'OSB sheathing 5/8" minimum required for 24" rafter spacing per IRC R803.1 Table. Attic inspection confirms [X]" rafter spacing requiring code-compliant decking thickness. Existing thinner decking must be replaced to meet code requirements.',
    photoEvidence: ['Attic photos showing rafter spacing', 'Decking thickness measurement'],
    typicalQuantitySource: 'SF of affected area from attic inspection',
    priority: 'high'
  },
  {
    code: 'RFGPLYCLP',
    name: 'Plywood Edge Clips',
    category: 'decking',
    ircCode: null,
    reason: 'Required for unsupported panel edges',
    defenseNote: 'Plywood/OSB edge clips (H-clips) required at unsupported panel edges per manufacturer installation specifications. Provides support at panel joints between rafters. Required for proper structural support and to prevent panel edge sagging.',
    photoEvidence: ['Attic photos showing unsupported edges'],
    typicalQuantitySource: 'Calculate based on panel layout',
    priority: 'medium'
  },

  // ==========================================
  // GUTTER & DRAINAGE ITEMS
  // ==========================================
  {
    code: 'GTRALM',
    name: 'Gutter Replacement',
    category: 'gutters',
    ircCode: null,
    reason: 'Storm-damaged gutters often omitted from roofing scope',
    defenseNote: 'Gutters show storm damage [dents/separation/misalignment] and require replacement to maintain proper drainage. Gutter damage occurred during same storm event as roof damage. Photos document gutter damage at [X] LF requiring replacement.',
    photoEvidence: ['Gutter damage photos', 'Dents/separation/alignment issues'],
    typicalQuantitySource: 'Damaged gutter LF from photos',
    priority: 'medium'
  },
  {
    code: 'GTRGUARD',
    name: 'Gutter Guard Replacement',
    category: 'gutters',
    ircCode: null,
    reason: 'Existing guards damaged during gutter D&R',
    defenseNote: 'Existing gutter guards damaged during gutter detach and reset for drip edge installation. Guards cannot be removed and reinstalled without damage. Replacement required to maintain LKQ with pre-storm gutter guard system.',
    photoEvidence: ['Existing gutter guard photos', 'Guard system type'],
    typicalQuantitySource: 'Gutter LF with guards installed',
    priority: 'medium'
  },
  {
    code: 'DSPOUT',
    name: 'Downspout Replacement',
    category: 'gutters',
    ircCode: null,
    reason: 'Storm-damaged downspouts with gutter damage',
    defenseNote: 'Downspouts show storm damage [dents/separation/misalignment] along with associated gutter damage. Proper drainage system requires functioning downspouts. Photos document downspout damage requiring replacement.',
    photoEvidence: ['Downspout damage photos'],
    typicalQuantitySource: 'Count damaged downspouts',
    priority: 'medium'
  },

  // ==========================================
  // PAINTING & FINISHING ITEMS
  // ==========================================
  {
    code: 'PNTDRIP',
    name: 'Paint Drip Edge',
    category: 'paint',
    ircCode: null,
    reason: 'LKQ requires matching painted drip edge',
    defenseNote: 'Existing drip edge is painted to match trim color. New drip edge must be painted to maintain Like Kind and Quality (LKQ). Paint provides both aesthetic matching and corrosion protection. Photos document painted drip edge requiring color match.',
    photoEvidence: ['Close-up of existing painted drip edge'],
    typicalQuantitySource: 'Total drip edge LF',
    priority: 'medium'
  },
  {
    code: 'PNTGTR',
    name: 'Paint Gutters',
    category: 'paint',
    ircCode: null,
    reason: 'Custom painted gutters require color matching',
    defenseNote: 'Existing gutters are custom painted to match trim color. Replacement gutters or damaged areas must be painted to maintain Like Kind and Quality (LKQ). Photos document custom painted gutters.',
    photoEvidence: ['Painted gutter photos showing color'],
    typicalQuantitySource: 'Gutter LF requiring paint',
    priority: 'medium'
  },
  {
    code: 'PNTVENTS',
    name: 'Paint Vents/Pipe Jacks',
    category: 'paint',
    ircCode: null,
    reason: 'Existing painted vents require color matching',
    defenseNote: 'Existing roof vents and pipe jacks are painted to match roof color. Replacement vents must be painted to maintain Like Kind and Quality (LKQ) and uniform appearance. Photos document painted vents requiring color match.',
    photoEvidence: ['Painted vent photos'],
    typicalQuantitySource: 'Count painted vents/boots',
    priority: 'medium'
  },

  // ==========================================
  // SPECIALTY ROOFING ITEMS
  // ==========================================
  {
    code: 'RFGBI',
    name: 'Modified Bitumen (Low Slope)',
    category: 'flat-roof',
    ircCode: 'R905.2.2',
    reason: 'Required for slopes below 2/12 per code',
    defenseNote: 'Modified bitumen roofing required per IRC R905.2.2 for roof slopes less than 2:12. Composition shingles are NOT approved for low-slope applications. Area at [location] measures [X]:12 which requires modified bitumen or similar low-slope system. Photos document low-slope area requiring proper roofing type.',
    photoEvidence: ['Low-slope area photos', 'Pitch measurement'],
    typicalQuantitySource: 'SF of low-slope area',
    priority: 'high'
  },
  {
    code: 'RFGCLOSURE',
    name: 'Closure Strips',
    category: 'specialty',
    ircCode: 'R904.1',
    reason: 'Required by manufacturer at metal roof transitions',
    defenseNote: 'Closure strips required per manufacturer installation instructions at metal roofing transitions. Must match existing LKQ closure strips per IRC R904.1. Required to prevent pest entry and maintain weathertight assembly at panel ends.',
    photoEvidence: ['Metal roof transition photos', 'Existing closure strips'],
    typicalQuantitySource: 'LF of transitions requiring closure',
    priority: 'medium'
  },

  // ==========================================
  // OVERHEAD & PROFIT
  // ==========================================
  {
    code: 'O&P',
    name: 'Overhead and Profit',
    category: 'overhead',
    ircCode: null,
    reason: 'Required when GC coordinates multiple trades or complex work',
    defenseNote: 'Overhead and Profit warranted per industry standards when: (1) multiple trades involved requiring general contractor coordination [list trades], (2) complexity requires project management and safety planning, (3) [steep pitch/two-story/complex design] requires crew coordination. This project involves coordination of [roofing, gutters, siding, interior, etc.] trades. O&P is standard for projects of this scope.',
    photoEvidence: ['Photos documenting complexity', 'Scope showing multiple trades'],
    typicalQuantitySource: 'Typically 10% overhead + 10% profit on labor',
    priority: 'high'
  },

  // ==========================================
  // HVAC & MECHANICAL
  // ==========================================
  {
    code: 'HVACCOMB',
    name: 'HVAC Condenser Coil Combing',
    category: 'hvac',
    ircCode: null,
    reason: 'Condenser fins damaged by hail require combing',
    defenseNote: 'HVAC condenser coil fins damaged by hail impact require combing to restore airflow. Bent/damaged fins restrict airflow and reduce system efficiency. Must comb to restore proper operation. Photos document condenser fin damage from storm.',
    photoEvidence: ['Condenser unit photos', 'Close-up of fin damage'],
    typicalQuantitySource: '1 EA per affected condenser',
    priority: 'medium'
  },

  // ==========================================
  // FASCIA & SOFFIT
  // ==========================================
  {
    code: 'FASCIA',
    name: 'Fascia Board Replacement',
    category: 'exterior',
    ircCode: null,
    reason: 'Damaged fascia discovered during gutter removal',
    defenseNote: 'Fascia board damage discovered during gutter detach and reset. Rot/deterioration requires replacement before gutter reinstallation. Cannot reinstall gutters on damaged fascia. Photos document fascia condition at [X] LF.',
    photoEvidence: ['Fascia damage photos after gutter removal'],
    typicalQuantitySource: 'LF of damaged fascia',
    priority: 'medium'
  },
  {
    code: 'SOFFIT',
    name: 'Soffit Repair/Replacement',
    category: 'exterior',
    ircCode: null,
    reason: 'Soffit damage from water intrusion or storm impact',
    defenseNote: 'Soffit damage from [water intrusion/storm impact] requires repair/replacement. Damaged soffit allows pest entry and compromises attic ventilation. Photos document soffit damage at [X] SF.',
    photoEvidence: ['Soffit damage photos', 'Water staining or impact damage'],
    typicalQuantitySource: 'SF of damaged soffit',
    priority: 'medium'
  },
  {
    code: 'ALFASCIA',
    name: 'Aluminum Fascia Wrap',
    category: 'exterior',
    ircCode: null,
    reason: 'Custom wrapped fascia requires LKQ replacement',
    defenseNote: 'Existing custom aluminum fascia wrap must be replaced to maintain Like Kind and Quality (LKQ). Removal during gutter D&R damages aluminum wrap. Photos document existing aluminum fascia wrap requiring replacement.',
    photoEvidence: ['Aluminum fascia wrap photos'],
    typicalQuantitySource: 'LF of wrapped fascia',
    priority: 'medium'
  },

  // ==========================================
  // ADDITIONAL MISCELLANEOUS ITEMS
  // ==========================================
  {
    code: 'RFGSNOW',
    name: 'Snow Guards',
    category: 'specialty',
    ircCode: null,
    reason: 'Required in snow regions to prevent slide damage',
    defenseNote: 'Snow guards required to prevent snow/ice slide from roof causing injury or property damage. Required in areas with significant snowfall. Existing snow guards must be replaced to maintain safety and LKQ. Photos document existing snow guard system.',
    photoEvidence: ['Existing snow guard photos', 'Installation pattern'],
    typicalQuantitySource: 'Count existing guards or calculate based on roof area',
    priority: 'medium'
  },
  {
    code: 'RFGCHASE',
    name: 'Chimney Chase Cover',
    category: 'flashing',
    ircCode: null,
    reason: 'Metal chase covers damaged by hail/storm',
    defenseNote: 'Chimney chase cover shows storm damage [dents/rust/separation] and requires replacement. Chase cover protects chimney chase from water intrusion. Must install custom cover (Like, Kind, Quality) to match existing size and style. Photos document chase cover damage.',
    photoEvidence: ['Chase cover damage photos', 'Measurements'],
    typicalQuantitySource: '1 EA per chimney chase',
    priority: 'high'
  },
  {
    code: 'RFGGABLE',
    name: 'Gable Vent Flashing',
    category: 'flashing',
    ircCode: null,
    reason: 'Gable vent flashing often omitted',
    defenseNote: 'Gable vent flashing required for weathertight assembly. Flashing integrates with siding and shingle courses. During reroof, flashing must be properly installed to maintain weathertight transition. Photos document gable vent location requiring flashing.',
    photoEvidence: ['Gable vent photos', 'Flashing condition'],
    typicalQuantitySource: '1 EA per gable vent',
    priority: 'medium'
  }
]

/**
 * Get all commonly missed items
 */
export function getAllMissedItems(): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS
}

/**
 * Get missed items by priority
 */
export function getMissedItemsByPriority(priority: 'critical' | 'high' | 'medium'): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS.filter(item => item.priority === priority)
}

/**
 * Get missed items by category
 */
export function getMissedItemsByCategory(category: string): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS.filter(item => item.category === category)
}

/**
 * Get the defense note for a specific item
 */
export function getDefenseNote(code: string): string | null {
  const item = COMMONLY_MISSED_ITEMS.find(i => i.code.toUpperCase() === code.toUpperCase())
  return item?.defenseNote || null
}

/**
 * Get all items that have specific IRC code requirements
 */
export function getCodeRequiredItems(): MissedItemTemplate[] {
  return COMMONLY_MISSED_ITEMS.filter(item => item.ircCode !== null)
}
