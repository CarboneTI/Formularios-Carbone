'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getSupabaseClient } from '@/lib/config'
import Logo from '@/components/Logo'

// Cliente Supabase
const supabase = getSupabaseClient()

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [userName, setUserName] = useState('Administrador')
  
  // Verificar autenticação e buscar nome do usuário
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar se está em modo de desenvolvimento
        const urlParams = typeof window !== 'undefined' 
          ? new URLSearchParams(window.location.search) 
          : new URLSearchParams('');
        const devBypass = urlParams.get('dev_bypass') === 'true';
        
        if (devBypass) {
          return;
        }
        
        // Verificação da sessão
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Em uma implementação real, buscaríamos o nome do usuário no banco de dados
          // Aqui estamos apenas usando o email como nome
          setUserName(session.user.email?.split('@')[0] || 'Administrador')
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      }
    }
    
    checkAuth()
  }, [])
  
  // Função para fazer logout
  const handleSignOut = async () => {
    // Remover cookie de autenticação local
    document.cookie = "local-auth-redirect=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    
    // Fazer logout no Supabase
    await supabase.auth.signOut()
    
    // Redirecionar para a página inicial
    window.location.href = '/'
  }

  // Verificar qual item do menu está ativo
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true
    }
    
    if (path !== '/dashboard' && pathname && pathname.startsWith(path)) {
      return true
    }
    
    return false
  }

  return (
    <div className="min-h-screen bg-[#0F1117] text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          
          <div className="flex items-center space-x-8">
            <div className="text-sm text-gray-400">
              Bem-vindo, <span className="text-white">{userName}</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 text-sm rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex max-w-7xl mx-auto">
        {/* Navegação lateral */}
        <aside className="w-64 p-6 border-r border-gray-800 min-h-[calc(100vh-4rem)]">
          <nav className="space-y-2 sticky top-6">
            <Link 
              href="/dashboard" 
              className={`block py-2 px-4 rounded-lg ${
                isActive('/dashboard') 
                  ? 'bg-[#FFC600] text-black' 
                  : 'hover:bg-gray-800 transition-colors'
              }`}
            >
              Gerenciar Usuários
            </Link>
            <Link 
              href="/dashboard/relatorios" 
              className={`block py-2 px-4 rounded-lg ${
                isActive('/dashboard/relatorios') 
                  ? 'bg-[#FFC600] text-black' 
                  : 'hover:bg-gray-800 transition-colors'
              }`}
            >
              Relatórios
            </Link>
            <Link 
              href="/dashboard/configuracoes" 
              className={`block py-2 px-4 rounded-lg ${
                isActive('/dashboard/configuracoes') 
                  ? 'bg-[#FFC600] text-black' 
                  : 'hover:bg-gray-800 transition-colors'
              }`}
            >
              Configurações
            </Link>
            <hr className="border-gray-800 my-4" />
            <Link 
              href="/formularios/formulario-de-criacao-de-prompt" 
              className="block py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              target="_blank"
            >
              Formulário de Prompts →
            </Link>
            <Link 
              href="/formularios/sac" 
              className="block py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              target="_blank"
            >
              Formulário SAC →
            </Link>
            <Link 
              href="/reagendamento" 
              className="block py-2 px-4 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              target="_blank"
            >
              Formulário de Reagendamento →
            </Link>
          </nav>
        </aside>
        
        {/* Conteúdo principal */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 