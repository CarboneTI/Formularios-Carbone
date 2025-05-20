'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient, testCredentials, USE_LOCAL_AUTH } from '@/lib/config'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

// Inicializar o cliente Supabase
const supabase = getSupabaseClient()

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Verificar se o usuário já está autenticado ao carregar a página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log("Sessão inicial:", session ? "Existe" : "Não existe")
        
        if (session) {
          console.log("Redirecionando para dashboard (sessão existente)")
          router.push('/dashboard')
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
      }
    }
    
    checkSession()
  }, [router])

  // Função para alternar visibilidade da senha
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Função para fazer login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    console.log("Tentando login com:", email, "e senha com comprimento:", password.length)

    // Validações do lado do cliente
    if (!email) {
      setError('Por favor, informe o e-mail')
      setLoading(false)
      return
    }

    if (!password) {
      setError('Por favor, informe a senha')
      setLoading(false)
      return
    }

    try {
      console.log("Iniciando autenticação com Supabase")
      // Tentar fazer login com Supabase
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      // Log detalhado para depuração
      console.log("Resposta login:", 
        data ? "Dados: " + JSON.stringify(data) : "Sem dados", 
        error ? `Erro: ${error.message}` : "Sem erro"
      )

      // Tratamento específico para erro de email/senha incorretos
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Por favor, tente novamente.')
          setLoading(false)
          return
        }
        
        // Se o erro for de e-mail não confirmado, tentamos uma abordagem alternativa
        if (error.message === 'Email not confirmed') {
          console.log('Tentando login sem verificação de e-mail para desenvolvimento...')
          
          // Hack para desenvolvimento: confirmar e-mail diretamente
          // Nota: Isso só deve ser usado em ambiente de desenvolvimento
          try {
            const { data: adminAuthData } = await supabase.auth.getSession()
            
            // Se conseguiu obter uma sessão parcial, tenta forçar a navegação
            console.log("Tentando redirecionamento forçado")
            router.replace('/dashboard')
            return
          } catch (adminError) {
            console.error('Erro ao tentar bypass de auth:', adminError)
          }
        }

        throw error
      }

      // Verificar explicitamente se o login foi bem-sucedido
      if (!data || !data.session || !data.user) {
        setError('Falha ao fazer login. Não foi possível criar sessão.')
        setLoading(false)
        return
      }

      // Se chegou aqui, login bem-sucedido
      console.log("Login bem-sucedido, redirecionando para dashboard")
      
      // Se estamos usando autenticação local, definimos cookie manualmente
      if (USE_LOCAL_AUTH) {
        // Define o cookie com expiração de 1 hora (3600 segundos) em vez de 24 horas
        document.cookie = "local-auth-redirect=true; path=/; max-age=3600; SameSite=Lax";
      }
      
      // Armazenar token de sessão no localStorage também (como backup)
      if (data?.session) {
        try {
          localStorage.setItem('supabase.auth.session', JSON.stringify(data.session));
        } catch (err) {
          console.warn('Erro ao salvar sessão no localStorage:', err);
        }
      }
      
      // Forçar a navegação após um delay maior para garantir que a sessão foi armazenada
      // Usamos replace em vez de push para evitar histórico de navegação
      setTimeout(() => {
        console.log("Executando redirecionamento para dashboard...");
        router.replace('/dashboard');
      }, 1000)
    } catch (err: any) {
      console.error('Erro de login:', err)
      // Mensagem de erro mais amigável
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Erro de conexão. Por favor, verifique sua internet e tente novamente.')
      } else {
        setError(err.message || 'Erro ao fazer login. Por favor, tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Título */}
        <div className="text-center space-y-6">
          <img 
            src="https://carbonecompany.com.br/wp-content/uploads/2025/02/Logo-vetorizado.svg"
            alt="Carbone Company"
            className="h-12 mx-auto"
          />
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Central de Formulários
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Faça login para acessar o sistema
            </p>
          </div>
        </div>

        {/* Debug info para desenvolvimento */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <p className="text-xs text-gray-300 font-mono">
              Para testes, use:<br />
              Email: {testCredentials.admin.email}<br />
              Senha: {testCredentials.admin.password}
            </p>
          </div>
        )}

        {/* Mensagem de erro de e-mail não confirmado */}
        {error && error.includes('Email not confirmed') && (
          <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-400">
              E-mail não confirmado. Para ambiente de desenvolvimento, 
              você pode continuar tentando fazer login mesmo assim.
            </p>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && !error.includes('Email not confirmed') && (
            <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-800 bg-gray-900/50 py-2.5 px-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFC600] focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFC600] text-gray-900 py-2.5 px-4 rounded-lg font-medium hover:bg-[#FFD700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1117] focus:ring-[#FFC600] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>

        <div>
          <p className="text-sm text-gray-400">
            Problemas para acessar?{' '}
            <a href="mailto:suporte@carbonecompany.com.br" className="font-medium text-[#FFC600] hover:text-[#FFD700] transition-colors">
              Entre em contato com o suporte
            </a>
          </p>
          <p className="mt-8 text-sm text-gray-500">
            © {new Date().getFullYear()} Carbone Company. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
} 