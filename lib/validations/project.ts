import { z } from 'zod'

export const projectSchema = z.object({
  address: z.string().min(5, 'Project address is required'),
  clientName: z.string().min(2, 'Client name is required'),
  projectType: z.string().min(2, 'Project type is required'),
})

export type ProjectFormData = z.infer<typeof projectSchema>

export const uploadSchema = z.object({
  projectId: z.string(),
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileType: z.enum(['scope', 'photo', 'document']),
  mimeType: z.string(),
  fileSize: z.number().positive(),
})

export type UploadFormData = z.infer<typeof uploadSchema>
