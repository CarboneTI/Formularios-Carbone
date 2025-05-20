import React from 'react'
import { FormSection as FormSectionType } from '@/lib/schemas/form'
import FormField from './FormField'

interface FormSectionProps {
  section: FormSectionType
  className?: string
}

export default function FormSection({ section, className = '' }: FormSectionProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cabeçalho da seção */}
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-lg font-semibold text-[#FFC600]">{section.title}</h3>
        {section.description && (
          <p className="mt-1 text-sm text-gray-400">{section.description}</p>
        )}
      </div>

      {/* Campos da seção */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.fields.map((field) => (
          <div
            key={field.id}
            className={
              field.type === 'textarea' || field.type === 'file'
                ? 'col-span-1 md:col-span-2'
                : ''
            }
          >
            <FormField field={field} />
          </div>
        ))}
      </div>
    </div>
  )
} 