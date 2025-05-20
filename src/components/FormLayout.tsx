import React from 'react'
import FormHeader from './FormHeader'
import FormFooter from './FormFooter'

interface FormLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  helpText?: string
  submitLabel?: string
  isLoading?: boolean
  showContactInfo?: boolean
  showBranding?: boolean
  onSubmit?: () => void
  onCancel?: () => void
  isValid?: boolean
  error?: string | null
  adminInfo?: {
    webhookUrl?: string
    description?: string
  }
}

export default function FormLayout({
  children,
  title,
  subtitle,
  showBackButton,
  backUrl,
  helpText,
  submitLabel,
  isLoading,
  showContactInfo,
  showBranding,
  onSubmit,
  onCancel,
  isValid,
  error,
  adminInfo
}: FormLayoutProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-gray-800 bg-gray-900/30">
      <FormHeader 
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backUrl={backUrl}
        helpText={helpText}
      />
      
      <div className="p-6">
        {children}
      </div>
      
      <FormFooter 
        submitLabel={submitLabel}
        isLoading={isLoading}
        showContactInfo={showContactInfo}
        showBranding={showBranding}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isValid={isValid}
        error={error}
        adminInfo={adminInfo}
      />
    </div>
  )
} 