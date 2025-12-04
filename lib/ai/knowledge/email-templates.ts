/**
 * Estimator Email Templates
 * 
 * Complete catalog of all 16 email types used in the supplement workflow.
 * Each template is designed to be professional, courteous, and action-focused.
 * 
 * Based on RISE Roofing Supplements estimator email catalog.
 */

export interface EmailTemplate {
  id: string
  name: string
  category: 'intake' | 'submission' | 'follow_up' | 'rebuttal' | 'escalation' | 'completion'
  purpose: string
  trigger: string
  recipients: {
    to: string
    cc: string[]
  }
  subjectTemplate: string
  bodyTemplate: string
  attachments: string[]
  followUpDays: number | null
  tips: string[]
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // ==========================================
  // INTAKE EMAILS
  // ==========================================
  {
    id: 'intake_missing_items',
    name: 'Intake — Missing Items Request',
    category: 'intake',
    purpose: 'Request missing documentation from contractor to start the 24-hour clock.',
    trigger: 'File received but incomplete',
    recipients: {
      to: 'Contractor/Sales Rep',
      cc: []
    },
    subjectTemplate: 'Action Needed: Missing Items for [PROPERTY ADDRESS]',
    bodyTemplate: `Hi [Contractor Name],

Thank you for submitting the file for [PROPERTY ADDRESS]. To begin the supplement process within our 24-hour turnaround, we need the following items:

**Missing Documents:**
[LIST MISSING ITEMS - e.g.]
- Adjuster scope PDF
- Measurement report (EagleView/HOVER)
- Full photo set (see checklist below)
- Claim number and carrier information

**Photo Checklist:**
[ ] Four ground-level elevations
[ ] Edge of roof (starter, drip edge, pitch)
[ ] All valleys and penetrations
[ ] Ridge and hip lines
[ ] Chimney with measurements
[ ] Attic (decking type, rafter spacing)

Once we receive these items, we'll have your supplement ready within 24 hours and begin our 48-hour carrier follow-up cadence.

Please reply to this email with the missing items or let me know if you have questions.

Thank you,
[YOUR NAME]
[COMPANY] | [PHONE] | [EMAIL]`,
    attachments: ['Photo checklist PDF (if available)'],
    followUpDays: 1,
    tips: [
      'Be specific about exactly what is missing',
      'Attach photo checklist to make it easy',
      'Emphasize the 24-hour turnaround once complete'
    ]
  },
  {
    id: 'contractor_ok_to_submit',
    name: 'Contractor OK-to-Submit',
    category: 'intake',
    purpose: 'Get final approval from contractor before sending supplement to carrier.',
    trigger: 'Supplement package complete and ready',
    recipients: {
      to: 'Contractor/Sales Rep',
      cc: []
    },
    subjectTemplate: 'Ready to Submit: [PROPERTY ADDRESS] - Please Review',
    bodyTemplate: `Hi [Contractor Name],

Your supplement package for [PROPERTY ADDRESS] is complete and ready for submission. Please review the attached estimate and let me know if you'd like any changes before I send to [CARRIER].

**Supplement Summary:**
- Total Supplement Request: $[AMOUNT]
- Key Items Added: [BRIEF LIST]
- Claim #: [NUMBER]
- Carrier: [NAME]

**Attached:**
- Xactimate Estimate PDF
- Photo Packet
- Measurement Report
- Cover Letter Draft

Please reply with "OK to submit" or any requested changes. Once approved, I'll submit today and begin the 48-hour follow-up cadence.

Thank you,
[YOUR NAME]`,
    attachments: ['Estimate PDF', 'Photo packet', 'Cover letter draft'],
    followUpDays: 1,
    tips: [
      'Make approval easy - just need "OK to submit"',
      'Highlight the dollar amount and key items',
      'Give them confidence in the package'
    ]
  },

  // ==========================================
  // SUBMISSION EMAILS
  // ==========================================
  {
    id: 'initial_supplement_submission',
    name: 'Initial Supplement Submission',
    category: 'submission',
    purpose: 'Submit supplement package to carrier with all documentation.',
    trigger: 'Contractor approval received',
    recipients: {
      to: 'Carrier claims email + Adjuster',
      cc: ['Homeowner']
    },
    subjectTemplate: 'Supplement for Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS]',
    bodyTemplate: `Hello [Carrier Team/Adjuster Name],

Please see the attached supplement package for the above-referenced claim.

**Claim Information:**
- Claim #: [NUMBER]
- Insured: [NAME]
- Property: [ADDRESS]
- Date of Loss: [DATE]

**Supplement Summary:**
[BULLET LIST OF KEY CORRECTIONS - e.g.]
• Drip edge required per IRC R905.2.8.5 — [X] LF
• Starter course omitted from waste — [X] LF
• Ice & water shield in valleys per R905.2.7.1 — [X] SF
• Step flashing at sidewalls per R905.2.8.3 — [X] LF
• Hip/ridge cap (not in waste per EagleView) — [X] LF

**Attachments:**
1. Corrected Xactimate estimate with line-item defense notes
2. Photo packet organized by elevation
3. Measurement report (EagleView/HOVER)
4. IRC code reference pages

**Requested Action:**
Please review and confirm acceptance, or advise of any additional documentation needed. I will follow up within 48 hours.

Thank you for your attention to this matter.

Best regards,
[YOUR NAME]
Estimator | [COMPANY]
[PHONE] | [EMAIL]`,
    attachments: ['Estimate PDF', 'Photo packet', 'Measurement report', 'Code references'],
    followUpDays: 1,
    tips: [
      'Subject line must include claim number',
      'CC homeowner for transparency',
      'Bullet points make key items scannable',
      'Always request confirmation of receipt'
    ]
  },
  {
    id: 'receipt_confirmation',
    name: 'Receipt & Adjuster Info Confirmation',
    category: 'follow_up',
    purpose: 'Confirm carrier received submission and get adjuster contact info.',
    trigger: 'Day 1 after submission',
    recipients: {
      to: 'Carrier claims email',
      cc: ['Homeowner']
    },
    subjectTemplate: 'RE: Claim #[CLAIM NUMBER] — Confirming Receipt',
    bodyTemplate: `Hello,

I am following up on the supplement submitted yesterday for Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS].

Could you please confirm:
1. Receipt of our supplement package
2. The assigned adjuster's name and direct contact information
3. Expected timeframe for review completion

I'm happy to provide any additional documentation needed. I will follow up again in 48 hours if I don't hear back.

Thank you,
[YOUR NAME]
[PHONE] | [EMAIL]`,
    attachments: [],
    followUpDays: 2,
    tips: [
      'Keep it brief - just confirming receipt',
      'Always ask for direct adjuster contact',
      'Set expectation for next follow-up'
    ]
  },

  // ==========================================
  // FOLLOW-UP EMAILS
  // ==========================================
  {
    id: 'cadence_follow_up',
    name: '48-Hour Cadence Follow-Up',
    category: 'follow_up',
    purpose: 'Regular follow-up until carrier responds.',
    trigger: 'Every 48 hours after submission with no response',
    recipients: {
      to: 'Adjuster',
      cc: ['Carrier claims email', 'Homeowner']
    },
    subjectTemplate: 'RE: Claim #[CLAIM NUMBER] — Follow-Up',
    bodyTemplate: `Hi [Adjuster Name],

I'm following up on the supplement for Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS] submitted on [DATE].

Could you please provide an update on the review status? We're happy to provide any additional documentation or clarification needed.

**Quick Reference:**
- Supplement Amount: $[AMOUNT]
- Key Items: [BRIEF LIST]

Please let me know if you need anything else. I'll follow up again in 48 hours if we don't connect.

Thank you,
[YOUR NAME]
[PHONE] | [EMAIL]`,
    attachments: [],
    followUpDays: 2,
    tips: [
      'Keep follow-ups brief and professional',
      'Reference the original submission date',
      'Offer to help, dont sound frustrated',
      'Maintain the 48-hour rhythm'
    ]
  },
  {
    id: 'evidence_addon',
    name: 'Evidence Add-On',
    category: 'follow_up',
    purpose: 'Send additional supporting documentation for specific items.',
    trigger: 'Adjuster requests more info or proactively strengthening case',
    recipients: {
      to: 'Adjuster',
      cc: []
    },
    subjectTemplate: 'RE: Claim #[CLAIM NUMBER] — Additional Documentation for [ITEM]',
    bodyTemplate: `Hi [Adjuster Name],

As requested, please find attached additional documentation supporting [SPECIFIC ITEM] for Claim #[CLAIM NUMBER].

**Supporting Evidence:**
[DESCRIBE WHAT YOU'RE PROVIDING - e.g.]
- IRC [CODE] excerpt highlighting the requirement
- Manufacturer installation guide page [X]
- Additional photos showing [CONDITION]
- Measurement verification

This documentation confirms [ITEM] is required per [CODE/MANUFACTURER/SPEC]. Please let me know if you need anything else.

Thank you,
[YOUR NAME]`,
    attachments: ['Relevant code pages', 'Manufacturer specs', 'Additional photos'],
    followUpDays: 2,
    tips: [
      'Be proactive - dont wait to be asked for everything',
      'One item at a time for clarity',
      'Highlight the key evidence'
    ]
  },
  {
    id: 'additional_docs_request',
    name: 'Additional Docs/Photos Request',
    category: 'follow_up',
    purpose: 'Request additional documentation from contractor/sales to support claim.',
    trigger: 'Carrier requests info contractor must provide',
    recipients: {
      to: 'Contractor/Sales Rep',
      cc: []
    },
    subjectTemplate: 'Action Needed: [PROPERTY ADDRESS] — Carrier Requests Additional Info',
    bodyTemplate: `Hi [Name],

The carrier has requested additional documentation for [PROPERTY ADDRESS] before they can approve the supplement.

**Needed Items:**
[LIST SPECIFIC REQUESTS - e.g.]
- Photo of chimney with measuring tape showing width
- Attic photo showing decking condition
- Photo of [specific component]

**Why It's Needed:**
[BRIEF EXPLANATION - e.g.]
The carrier wants to verify the chimney exceeds 30" for the cricket requirement per IRC R903.2.2.

Please send these photos as soon as possible so we can keep the claim moving. Let me know if you have questions about what they're looking for.

Thank you,
[YOUR NAME]`,
    attachments: [],
    followUpDays: 1,
    tips: [
      'Be specific about what photos/docs are needed',
      'Explain WHY so they get the right shots',
      'Create urgency without being pushy'
    ]
  },

  // ==========================================
  // REBUTTAL EMAILS
  // ==========================================
  {
    id: 'rebuttal_line_by_line',
    name: 'Rebuttal — Line-by-Line Counter',
    category: 'rebuttal',
    purpose: 'Respond to carrier objections with evidence-based rebuttals.',
    trigger: 'Carrier denies or reduces items',
    recipients: {
      to: 'Adjuster',
      cc: ['Carrier claims email', 'Homeowner']
    },
    subjectTemplate: 'RE: Claim #[CLAIM NUMBER] — Response to [DATE] Review',
    bodyTemplate: `Hi [Adjuster Name],

Thank you for your review of Claim #[CLAIM NUMBER]. We respectfully disagree with the following determinations and provide our response below:

---

**Item 1: [ITEM NAME]**
*Carrier Position:* "[QUOTE THEIR OBJECTION]"

*Our Response:*
[2-4 SENTENCE REBUTTAL WITH CITATION]
Per IRC [CODE]: "[RELEVANT QUOTE]"
Photos on page [X] document [EVIDENCE].

---

**Item 2: [ITEM NAME]**
*Carrier Position:* "[QUOTE THEIR OBJECTION]"

*Our Response:*
[2-4 SENTENCE REBUTTAL]
[Manufacturer] installation instructions specifically require [ITEM] per [SECTION].
Measurement report confirms [QUANTITY].

---

We request these items be reconsidered based on the code and manufacturer requirements cited above. Please advise if additional documentation is needed.

Thank you,
[YOUR NAME]`,
    attachments: ['Updated code references if needed', 'Additional photos if applicable'],
    followUpDays: 2,
    tips: [
      'Quote their objection exactly',
      'Keep rebuttals to 2-4 sentences each',
      'One authoritative citation per item',
      'Stay professional - no arguing'
    ]
  },
  {
    id: 'reinspection_request',
    name: 'Reinspection / Adjuster Call Request',
    category: 'rebuttal',
    purpose: 'Request reinspection or call to resolve disputed items.',
    trigger: 'Photo evidence insufficient or adjuster needs to see in person',
    recipients: {
      to: 'Adjuster',
      cc: ['Contractor/Sales Rep']
    },
    subjectTemplate: 'RE: Claim #[CLAIM NUMBER] — Requesting Reinspection',
    bodyTemplate: `Hi [Adjuster Name],

Regarding Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS], we believe a reinspection would be beneficial to resolve the outstanding items.

**Items Requiring On-Site Verification:**
[LIST ITEMS - e.g.]
- Decking condition (attic access available)
- Chimney dimensions for cricket requirement
- Step flashing condition at sidewalls

**Proposed Scheduling:**
Our contractor is available [DAYS/TIMES] to meet at the property. Please let me know what works for your schedule.

If a call would be helpful to discuss before scheduling the reinspection, I'm available at [PHONE].

Thank you,
[YOUR NAME]`,
    attachments: [],
    followUpDays: 2,
    tips: [
      'Reinspection can break deadlocks',
      'Have contractor available to attend',
      'Offer multiple scheduling options',
      'Phone call offer shows flexibility'
    ]
  },

  // ==========================================
  // ESCALATION EMAILS
  // ==========================================
  {
    id: 'manager_escalation',
    name: 'Manager Escalation',
    category: 'escalation',
    purpose: 'Escalate to carrier management when adjuster unresponsive or unreasonable.',
    trigger: 'No response after multiple follow-ups or unreasonable denial',
    recipients: {
      to: 'Carrier claims main line/management',
      cc: ['Original adjuster', 'Homeowner']
    },
    subjectTemplate: 'Escalation Request: Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS]',
    bodyTemplate: `Hello,

I am requesting management review of Claim #[CLAIM NUMBER] for [INSURED NAME] at [PROPERTY ADDRESS].

**Issue:**
[DESCRIBE THE ISSUE - e.g.]
- Supplement submitted [DATE]
- Multiple follow-ups sent ([DATES])
- No response received / Unreasonable denial of code-required items

**Claim Summary:**
- Date of Loss: [DATE]
- Current Adjuster: [NAME]
- Supplement Amount: $[AMOUNT]
- Primary Items in Dispute: [LIST]

**Supporting Documentation:**
Code-required items have been documented with IRC references and manufacturer specifications. We have provided [X] photos and measurement reports supporting our position.

We request a manager review and response within 48 hours. The insured's property remains in need of repair.

Thank you for your attention to this matter.

[YOUR NAME]
[PHONE] | [EMAIL]`,
    attachments: ['Complete claim file if not previously sent'],
    followUpDays: 2,
    tips: [
      'Document all prior contact attempts',
      'Keep tone professional, not emotional',
      'CC the original adjuster',
      'Emphasize homeowner impact'
    ]
  },
  {
    id: 'homeowner_new_adjuster',
    name: 'Homeowner Assist — Request New Adjuster',
    category: 'escalation',
    purpose: 'Help homeowner request a new adjuster when current one is hostile.',
    trigger: 'Adjuster is unreasonable or hostile despite proper documentation',
    recipients: {
      to: 'Homeowner',
      cc: ['Contractor']
    },
    subjectTemplate: '[PROPERTY ADDRESS] — Suggested Next Steps with [CARRIER]',
    bodyTemplate: `Hi [Homeowner Name],

I wanted to update you on your claim and suggest a potential next step.

**Current Situation:**
We've submitted your supplement with full code documentation, but the current adjuster [NAME] has [DESCRIBE ISSUE - e.g., not responded / denied code-required items without justification].

**Recommended Action:**
You, as the policyholder, have the right to request a different adjuster. Here's what to say if you call [CARRIER] at [NUMBER]:

"I am the policyholder for Claim #[NUMBER]. I am requesting a different adjuster be assigned to my claim. I feel the current adjuster is not fairly reviewing the documentation provided by my contractor."

**What Happens Next:**
Carriers typically honor this request. A new adjuster will review your file fresh, which often leads to better outcomes.

Would you like to try this approach? I'm happy to answer any questions.

Thank you,
[YOUR NAME]`,
    attachments: [],
    followUpDays: 1,
    tips: [
      'Give them exact language to use',
      'Explain their rights as policyholder',
      'Make the action easy',
      'Follow up to see if they did it'
    ]
  },

  // ==========================================
  // BUILD & COMPLETION EMAILS
  // ==========================================
  {
    id: 'build_day_reminder',
    name: 'Build-Day Photo Checklist Reminder',
    category: 'completion',
    purpose: 'Remind contractor to document conditions on build day.',
    trigger: 'Build scheduled for next day or week',
    recipients: {
      to: 'Contractor/Sales Rep',
      cc: []
    },
    subjectTemplate: 'Reminder: Build Day Photos for [PROPERTY ADDRESS]',
    bodyTemplate: `Hi [Name],

Just a reminder about documenting conditions during the build at [PROPERTY ADDRESS] scheduled for [DATE].

**Day-of-Build Photo Checklist:**
[ ] Decking condition after tear-off (any damage not visible before)
[ ] Any hidden flashing issues revealed
[ ] Chimney cricket condition
[ ] Step flashing at removal
[ ] Any additional damage discovered
[ ] Completed work photos

**Why It Matters:**
If you discover any additional damage (bad decking, rotted fascia, etc.), photos during the build let us submit a post-build supplement.

Please text/email photos to me as you find anything noteworthy. Good luck with the build!

Thank you,
[YOUR NAME]`,
    attachments: [],
    followUpDays: null,
    tips: [
      'Send the day before build',
      'Make the checklist simple',
      'Emphasize hidden damage opportunity',
      'Ask for real-time updates'
    ]
  },
  {
    id: 'post_build_supplement',
    name: 'Post-Build Supplement Submission',
    category: 'completion',
    purpose: 'Submit supplement for additional items discovered during build.',
    trigger: 'Contractor documents additional damage during tear-off',
    recipients: {
      to: 'Adjuster',
      cc: ['Carrier claims email', 'Homeowner']
    },
    subjectTemplate: 'Post-Build Supplement: Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS]',
    bodyTemplate: `Hi [Adjuster Name],

During the roof replacement at [PROPERTY ADDRESS] on [BUILD DATE], additional damage was discovered that was not visible during the initial inspection. We are submitting a post-build supplement for these items.

**Additional Items Discovered:**
[LIST ITEMS WITH DOCUMENTATION - e.g.]
- Decking replacement: [X] SF of water-damaged OSB discovered at [LOCATION]. Photos attached showing rot/damage not visible from attic prior to tear-off.
- Fascia repair: [X] LF of rotted fascia behind gutters, revealed during gutter D&R.

**Attached Documentation:**
- Photos showing discovered conditions
- Measurement of affected areas
- Updated Xactimate estimate

These items were not identifiable until the existing roofing was removed and represent legitimate storm-related damage requiring repair for a complete, code-compliant installation.

Please review and advise. Thank you,
[YOUR NAME]`,
    attachments: ['Build day photos', 'Updated estimate'],
    followUpDays: 2,
    tips: [
      'Submit quickly after build',
      'Clear photos are essential',
      'Explain why it wasnt visible before',
      'Keep quantities accurate'
    ]
  },
  {
    id: 'final_invoice',
    name: 'Final Invoice to Carrier',
    category: 'completion',
    purpose: 'Submit final invoice and request depreciation release.',
    trigger: 'Work completed and documented',
    recipients: {
      to: 'Adjuster',
      cc: ['Carrier claims email', 'Homeowner']
    },
    subjectTemplate: 'Final Invoice & Depreciation Release: Claim #[CLAIM NUMBER]',
    bodyTemplate: `Hi [Adjuster Name],

Work has been completed for Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS]. Please find attached the final invoice and completion documentation.

**Completion Summary:**
- Work Completed: [DATE]
- Final Invoice Amount: $[AMOUNT]
- Recoverable Depreciation: $[AMOUNT]

**Attached:**
- Final invoice
- Certificate of Completion
- Completion photos
- Permit sign-off (if applicable)

**Requested Action:**
Please process the recoverable depreciation release of $[AMOUNT] to the insured. The work has been completed per the approved scope.

Thank you for your assistance throughout this claim.

[YOUR NAME]`,
    attachments: ['Final invoice', 'Certificate of Completion', 'Completion photos', 'Permit (if applicable)'],
    followUpDays: 2,
    tips: [
      'Include all required completion docs',
      'State exact depreciation amount',
      'CC homeowner so they know to expect payment'
    ]
  },
  {
    id: 'depreciation_release_follow_up',
    name: 'Depreciation Release Confirmation',
    category: 'completion',
    purpose: 'Follow up on depreciation release after final invoice.',
    trigger: 'No payment received after final invoice',
    recipients: {
      to: 'Adjuster',
      cc: ['Homeowner']
    },
    subjectTemplate: 'RE: Claim #[CLAIM NUMBER] — Depreciation Release Status',
    bodyTemplate: `Hi [Adjuster Name],

I'm following up on the depreciation release for Claim #[CLAIM NUMBER] — [PROPERTY ADDRESS].

**Timeline:**
- Work Completed: [DATE]
- Final Invoice Submitted: [DATE]
- Recoverable Depreciation: $[AMOUNT]

Has the depreciation release been processed? If there are any additional requirements, please let me know.

The insured is awaiting this payment to finalize the project.

Thank you,
[YOUR NAME]`,
    attachments: [],
    followUpDays: 2,
    tips: [
      'Stay on this until payment is confirmed',
      'Homeowner should be watching for check',
      'Some carriers mail directly to insured'
    ]
  },
  {
    id: 'payment_closure',
    name: 'Payment / Closure Notice',
    category: 'completion',
    purpose: 'Confirm payment received and close out claim in CRM.',
    trigger: 'Homeowner confirms depreciation received',
    recipients: {
      to: 'Contractor',
      cc: []
    },
    subjectTemplate: 'Claim Closed: [PROPERTY ADDRESS] — Final Summary',
    bodyTemplate: `Hi [Contractor Name],

Great news — the depreciation has been released for [PROPERTY ADDRESS]. Here's the final claim summary:

**Claim Summary:**
- Claim #: [NUMBER]
- Carrier: [NAME]
- Original Scope: $[AMOUNT]
- Final Approved: $[AMOUNT]
- Total Supplement Value: $[AMOUNT]
- D$/SQ: $[AMOUNT]

**Key Wins:**
[BULLET LIST OF MAJOR ITEMS APPROVED - e.g.]
- Drip edge added: $[AMOUNT]
- Starter course added: $[AMOUNT]
- O&P approved: $[AMOUNT]

This claim is now closed in our system. Thanks for the opportunity to work on this one!

[YOUR NAME]`,
    attachments: [],
    followUpDays: null,
    tips: [
      'Celebrate the wins',
      'Show the value delivered',
      'Good summary for contractor records'
    ]
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get email template by ID
 */
export function getEmailTemplate(id: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find(t => t.id === id)
}

/**
 * Get all templates for a category
 */
export function getEmailsByCategory(category: EmailTemplate['category']): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter(t => t.category === category)
}

/**
 * Get next email in workflow based on current status
 */
export function getNextEmail(currentStatus: string): EmailTemplate | undefined {
  const statusToEmail: Record<string, string> = {
    'intake_incomplete': 'intake_missing_items',
    'ready_to_submit': 'contractor_ok_to_submit',
    'approved_to_submit': 'initial_supplement_submission',
    'submitted': 'receipt_confirmation',
    'awaiting_response': 'cadence_follow_up',
    'objection_received': 'rebuttal_line_by_line',
    'no_response': 'manager_escalation',
    'build_scheduled': 'build_day_reminder',
    'build_complete': 'final_invoice',
    'awaiting_depreciation': 'depreciation_release_follow_up'
  }
  
  const emailId = statusToEmail[currentStatus]
  return emailId ? getEmailTemplate(emailId) : undefined
}

/**
 * Get all follow-up emails
 */
export function getFollowUpEmails(): EmailTemplate[] {
  return EMAIL_TEMPLATES.filter(t => 
    t.category === 'follow_up' || t.followUpDays !== null
  )
}

/**
 * Generate email subject from template
 */
export function generateSubject(templateId: string, data: Record<string, string>): string {
  const template = getEmailTemplate(templateId)
  if (!template) return ''
  
  let subject = template.subjectTemplate
  Object.entries(data).forEach(([key, value]) => {
    subject = subject.replace(`[${key.toUpperCase()}]`, value)
  })
  return subject
}
