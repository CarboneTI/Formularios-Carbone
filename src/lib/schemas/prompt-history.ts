import * as z from 'zod'

// Interface para um item do histórico
export interface PromptHistoryItem {
  id: string
  userId?: string
  prompt: string
  response: string
  formType: string
  formData: Record<string, any>
  createdAt: string
  isSynced: boolean
}

// Schema Zod para validação
export const promptHistoryItemSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  prompt: z.string(),
  response: z.string(),
  formType: z.string(),
  formData: z.record(z.any()),
  createdAt: z.string(),
  isSynced: z.boolean()
})

export const promptHistorySchema = z.array(promptHistoryItemSchema) 