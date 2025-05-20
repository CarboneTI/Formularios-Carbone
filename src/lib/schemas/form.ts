import * as z from 'zod'

// Tipos de campos disponíveis
export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime'
  | 'number'
  | 'password'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'file'

// Interface para opções de campos select/radio/checkbox
export interface FieldOption {
  label: string
  value: string
}

// Interface para campos de formulário
export interface FormField {
  id: string
  type: FieldType
  label: string
  name: string
  placeholder?: string
  defaultValue?: string | number | boolean | string[]
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  options?: FieldOption[]
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    customMessage?: string
  }
}

// Interface para seções de formulário
export interface FormSection {
  id: string
  title: string
  description?: string
  order: number
  fields: FormField[]
}

// Interface para formulários
export interface Form {
  id: string
  title: string
  description?: string
  isActive: boolean
  isPublic: boolean
  requiresAuth: boolean
  sections: FormSection[]
  customStyles?: Record<string, string>
  metadata?: Record<string, any>
}

// Schema Zod para validação de opções de campo
const fieldOptionSchema = z.object({
  label: z.string(),
  value: z.string()
})

// Schema Zod para validação de campos
const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    'text',
    'email',
    'tel',
    'url',
    'date',
    'time',
    'datetime',
    'number',
    'password',
    'textarea',
    'select',
    'multiselect',
    'radio',
    'checkbox',
    'file'
  ]),
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  defaultValue: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string())
  ]).optional(),
  required: z.boolean().optional(),
  disabled: z.boolean().optional(),
  hidden: z.boolean().optional(),
  options: z.array(fieldOptionSchema).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    customMessage: z.string().optional()
  }).optional()
})

// Schema Zod para validação de seções
const formSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  order: z.number(),
  fields: z.array(formFieldSchema)
})

// Schema Zod para validação de formulários
export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  isPublic: z.boolean(),
  requiresAuth: z.boolean(),
  sections: z.array(formSectionSchema),
  customStyles: z.record(z.string()).optional(),
  metadata: z.record(z.any()).optional()
})

// Função para criar um schema de validação dinâmico baseado nos campos do formulário
export function createDynamicSchema(form: Form) {
  const schemaFields: Record<string, any> = {}

  form.sections.forEach(section => {
    section.fields.forEach(field => {
      let fieldSchema = z.any()

      switch (field.type) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string()
          if (field.validation?.minLength) {
            fieldSchema = fieldSchema.min(field.validation.minLength, field.validation.customMessage)
          }
          if (field.validation?.maxLength) {
            fieldSchema = fieldSchema.max(field.validation.maxLength, field.validation.customMessage)
          }
          if (field.validation?.pattern) {
            fieldSchema = fieldSchema.regex(new RegExp(field.validation.pattern), field.validation.customMessage)
          }
          break

        case 'email':
          fieldSchema = z.string().email(field.validation?.customMessage)
          break

        case 'number':
          fieldSchema = z.number()
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.validation.min, field.validation.customMessage)
          }
          if (field.validation?.max !== undefined) {
            fieldSchema = fieldSchema.max(field.validation.max, field.validation.customMessage)
          }
          break

        case 'tel':
          fieldSchema = z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, field.validation?.customMessage || 'Telefone inválido')
          break

        case 'url':
          fieldSchema = z.string().url(field.validation?.customMessage)
          break

        case 'date':
        case 'time':
        case 'datetime':
          fieldSchema = z.string().datetime(field.validation?.customMessage)
          break

        case 'select':
        case 'radio':
          fieldSchema = z.string()
          if (field.options) {
            fieldSchema = fieldSchema.refine(
              value => field.options?.some(option => option.value === value),
              field.validation?.customMessage || 'Opção inválida'
            )
          }
          break

        case 'multiselect':
          fieldSchema = z.array(z.string())
          if (field.options) {
            fieldSchema = fieldSchema.refine(
              values => values.every(value => field.options?.some(option => option.value === value)),
              field.validation?.customMessage || 'Uma ou mais opções são inválidas'
            )
          }
          break

        case 'checkbox':
          fieldSchema = z.boolean()
          break

        case 'file':
          fieldSchema = z.instanceof(File).optional()
          break

        default:
          fieldSchema = z.any()
      }

      if (field.required) {
        fieldSchema = fieldSchema.refine(value => value !== undefined && value !== null && value !== '', {
          message: field.validation?.customMessage || 'Campo obrigatório'
        })
      } else {
        fieldSchema = fieldSchema.optional()
      }

      schemaFields[field.name] = fieldSchema
    })
  })

  return z.object(schemaFields)
} 