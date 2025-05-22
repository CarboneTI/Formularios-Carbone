'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
  className?: string
}

export default function DateTimePicker({
  value,
  onChange,
  label,
  required = false,
  className = ''
}: DateTimePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [showNative, setShowNative] = useState(false)

  // Detecta se está em dispositivo móvel
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    setShowNative(isMobile)
  }, [])

  // Formata a data para exibição
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    } catch (error) {
      return dateString
    }
  }

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker()
    }
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-[#FFC600] ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-input w-full pr-10 cursor-pointer"
          required={required}
          onClick={handleInputClick}
        />
        
        {/* Ícone de Calendário */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-[#FFC600]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Data formatada em português */}
      {value && (
        <div className="mt-1 text-sm text-gray-400">
          {formatDisplayDate(value)}
        </div>
      )}
    </div>
  )
} 