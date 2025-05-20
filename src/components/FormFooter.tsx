import Image from 'next/image'
import { Info } from 'lucide-react'

interface FormFooterProps {
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

export default function FormFooter({
  submitLabel = 'Enviar',
  isLoading = false,
  showContactInfo = true,
  showBranding = true,
  onSubmit,
  onCancel,
  isValid = true,
  error = null,
  adminInfo
}: FormFooterProps) {
  return (
    <div className="bg-gray-900/50 p-6 rounded-b-xl border-t border-gray-800">
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {showBranding && (
            <div className="flex items-center gap-2">
              <Image 
                src="/assets/logo-carbone.svg" 
                alt="Carbone Company" 
                width={24} 
                height={24}
                className="opacity-70"
              />
              <span className="text-sm text-gray-400">Carbone Company</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !isValid}
            onClick={onSubmit}
            className="px-5 py-2.5 bg-[#FFC600] text-black rounded-lg font-medium hover:bg-[#FFD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1117] focus:ring-[#FFC600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </div>
      
      {showContactInfo && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Problemas ou dúvidas?{' '}
            <a 
              href="mailto:suporte@carbonecompany.com.br" 
              className="text-[#FFC600] hover:text-[#FFD700] transition-colors"
            >
              suporte@carbonecompany.com.br
            </a>
          </p>
        </div>
      )}
      
      {/* Admin Information - Visible only when adminInfo is provided */}
      {adminInfo && (
        <div className="mt-6 border-t border-gray-800 pt-4">
          <details className="text-left">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Informações do formulário (Somente para Administradores)
            </summary>
            <div className="mt-3 p-3 bg-gray-800/50 rounded-lg text-sm text-gray-300">
              {adminInfo.webhookUrl && (
                <>
                  <p>O formulário está configurado para enviar dados para o webhook:</p>
                  <code className="block mt-2 p-2 bg-gray-900 rounded text-xs overflow-auto break-all">
                    {adminInfo.webhookUrl}
                  </code>
                </>
              )}
              
              {adminInfo.description && (
                <p className="mt-2 text-xs text-gray-400">
                  {adminInfo.description}
                </p>
              )}
              
              <p className="mt-2 text-xs text-gray-400">
                Para configurar ou modificar este formulário, acesse o painel administrativo.
              </p>
            </div>
          </details>
        </div>
      )}
    </div>
  )
} 