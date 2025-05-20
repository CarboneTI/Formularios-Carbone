import Link from 'next/link'
import { ArrowLeft, HelpCircle } from 'lucide-react'

interface FormHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
  helpText?: string
}

export default function FormHeader({
  title,
  subtitle,
  showBackButton = true,
  backUrl = '/dashboard',
  helpText
}: FormHeaderProps) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-t-xl border-b border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {showBackButton && (
            <Link 
              href={backUrl} 
              className="text-gray-400 hover:text-white inline-flex items-center mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-sm">Voltar</span>
            </Link>
          )}
          
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        {helpText && (
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-3 text-sm text-gray-300 max-w-xl">
            <div className="flex gap-2">
              <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p>{helpText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 