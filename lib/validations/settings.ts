import { z } from 'zod'

export const userPreferencesSchema = z.object({
  // Display preferences
  theme: z.enum(['light', 'dark', 'system']).optional(),
  
  // Notification preferences
  emailNotifications: z.boolean().optional(),
  claimStatusUpdates: z.boolean().optional(),
  documentGenerationNotify: z.boolean().optional(),
  
  // AI preferences
  defaultDetailLevel: z.enum(['concise', 'standard', 'detailed']).optional(),
  autoAnalyzePhotos: z.boolean().optional(),
  
  // Default values
  defaultCarrier: z.string().optional(),
  defaultProjectType: z.string().optional(),
  
  // Company info
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
})

export type UserPreferences = z.infer<typeof userPreferencesSchema>

export const defaultPreferences: UserPreferences = {
  theme: 'system',
  emailNotifications: true,
  claimStatusUpdates: true,
  documentGenerationNotify: false,
  defaultDetailLevel: 'standard',
  autoAnalyzePhotos: true,
  defaultCarrier: '',
  defaultProjectType: '',
  companyName: '',
  phoneNumber: '',
}
