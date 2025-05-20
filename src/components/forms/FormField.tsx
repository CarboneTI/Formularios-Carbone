import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormField as FormFieldType } from '@/lib/schemas/form'

interface FormFieldProps {
  field: FormFieldType
  className?: string
}

export default function FormField({ field, className = '' }: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[field.name]?.message as string | undefined

  // Renderizar campo com base no tipo
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
      case 'date':
      case 'time':
      case 'datetime':
        return (
          <input
            type={field.type}
            id={field.id}
            {...register(field.name)}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            disabled={field.disabled}
            className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
          />
        )

      case 'textarea':
        return (
          <textarea
            id={field.id}
            {...register(field.name)}
            placeholder={field.placeholder}
            defaultValue={field.defaultValue}
            disabled={field.disabled}
            rows={4}
            className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
          />
        )

      case 'select':
        return (
          <select
            id={field.id}
            {...register(field.name)}
            defaultValue={field.defaultValue}
            disabled={field.disabled}
            className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'multiselect':
        return (
          <select
            id={field.id}
            {...register(field.name)}
            defaultValue={field.defaultValue}
            disabled={field.disabled}
            multiple
            className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-3 px-4 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${option.value}`}
                  {...register(field.name)}
                  value={option.value}
                  defaultChecked={field.defaultValue === option.value}
                  disabled={field.disabled}
                  className="h-4 w-4 border-gray-700 bg-gray-900 text-[#FFC600] focus:ring-[#FFC600] focus:ring-offset-gray-900"
                />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="ml-2 block text-sm text-gray-300"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              {...register(field.name)}
              defaultChecked={field.defaultValue as boolean}
              disabled={field.disabled}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-[#FFC600] focus:ring-[#FFC600] focus:ring-offset-gray-900"
            />
            <label
              htmlFor={field.id}
              className="ml-2 block text-sm text-gray-300"
            >
              {field.label}
            </label>
          </div>
        )

      case 'file':
        return (
          <input
            type="file"
            id={field.id}
            {...register(field.name)}
            disabled={field.disabled}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFC600] file:text-gray-900 hover:file:bg-[#FFD700]"
          />
        )

      default:
        return null
    }
  }

  if (field.hidden) return null

  return (
    <div className={`space-y-1 ${className}`}>
      {field.type !== 'checkbox' && (
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-300"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
} 