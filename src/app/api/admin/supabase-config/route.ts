import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/config'
import { 
  testSupabaseConnection, 
  initializeSupabaseDatabase, 
  saveSupabaseConfig 
} from '@/lib/supabase-init'

// Verificar se o usuário é super admin
const isUserSuperAdmin = async (req: NextRequest) => {
  try {
    // Em ambiente de desenvolvimento, permitir todas as solicitações
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    
    // Obter cliente Supabase
    const supabase = getSupabaseAdminClient()
    
    // Obter usuário da sessão
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return false
    }
    
    // Verificar se o usuário é admin
    // Em uma implementação real, você consultaria o banco para verificar a role
    return session.user.email === 'admin@carbonecompany.com'
  } catch (error) {
    console.error('Erro ao verificar permissões:', error)
    return false
  }
}

// Rota para testar a conexão com o Supabase
export async function POST(req: NextRequest) {
  try {
    // Verificar permissões
    const isSuperAdmin = await isUserSuperAdmin(req)
    
    if (!isSuperAdmin) {
      return NextResponse.json({ 
        error: 'Permissão negada. Apenas super administradores podem acessar esta API.' 
      }, { status: 403 })
    }
    
    // Extrair dados do corpo da requisição
    const { action, url, key, settings } = await req.json()
    
    if (!url || !key) {
      return NextResponse.json({ 
        error: 'URL e chave do Supabase são obrigatórios' 
      }, { status: 400 })
    }
    
    // Executar a ação apropriada com base no parâmetro "action"
    switch (action) {
      case 'test_connection':
        // Testar conexão com o Supabase
        try {
          const result = await testSupabaseConnection(url, key)
          return NextResponse.json(result)
        } catch (error: any) {
          console.error('Erro ao testar conexão:', error)
          return NextResponse.json({ 
            error: `Falha ao conectar: ${error.message || 'Erro desconhecido'}` 
          }, { status: 500 })
        }
        
      case 'initialize_database':
        // Inicializar banco de dados
        try {
          const result = await initializeSupabaseDatabase(url, key)
          
          // Salvar configurações
          await saveSupabaseConfig(url, key)
          
          return NextResponse.json(result)
        } catch (error: any) {
          console.error('Erro ao inicializar banco de dados:', error)
          
          // Se o erro já estiver formatado com logs, retorná-lo dessa forma
          if (error.logs) {
            return NextResponse.json({ 
              error: error.message || 'Falha ao inicializar banco',
              logs: error.logs 
            }, { status: 500 })
          }
          
          return NextResponse.json({ 
            error: `Falha ao inicializar banco: ${error.message || 'Erro desconhecido'}` 
          }, { status: 500 })
        }
        
      case 'save_config':
        // Salvar configurações do Supabase
        try {
          const result = await saveSupabaseConfig(url, key)
          return NextResponse.json(result)
        } catch (error: any) {
          console.error('Erro ao salvar configurações:', error)
          return NextResponse.json({ 
            error: `Falha ao salvar configurações: ${error.message || 'Erro desconhecido'}` 
          }, { status: 500 })
        }
        
      default:
        return NextResponse.json({ 
          error: 'Ação inválida. Ações válidas: test_connection, initialize_database, save_config' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' }, 
      { status: 500 }
    )
  }
} 