import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient, supabaseConfig } from '@/lib/config'
import { updateSystemSettings } from '@/lib/supabase-init'

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

// Obter configurações do sistema
export async function GET(req: NextRequest) {
  try {
    // Verificar permissões
    const isSuperAdmin = await isUserSuperAdmin(req)
    
    if (!isSuperAdmin) {
      return NextResponse.json({ 
        error: 'Permissão negada. Apenas super administradores podem acessar esta API.' 
      }, { status: 403 })
    }
    
    // Obter cliente Supabase
    const supabase = getSupabaseAdminClient()
    
    // Em desenvolvimento, simular resposta
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        settings: {
          domain: 'app.carbonecompany.com',
          webhook_url: 'https://autogrowth.cabonesolucoes.com.br/webhook/b1551055-3ebb-4a94-8aea-89488772d8ff-unico',
          notification_email: 'admin@carbonecompany.com',
          notifications_enabled: true,
          session_timeout: '60',
          dark_theme: true
        }
      })
    }
    
    // Obter configurações do banco
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
    
    if (error) {
      console.error('Erro ao obter configurações:', error)
      return NextResponse.json({ 
        error: 'Erro ao obter configurações do sistema' 
      }, { status: 500 })
    }
    
    // Transformar array de objetos em objeto único
    const settings = data.reduce((acc, curr) => {
      // Transformar valores booleanos e numéricos
      let value = curr.value
      if (value === 'true') value = true
      else if (value === 'false') value = false
      else if (!isNaN(Number(value)) && value.trim() !== '') value = Number(value)
      
      return { ...acc, [curr.key]: value }
    }, {})
    
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' }, 
      { status: 500 }
    )
  }
}

// Atualizar configurações do sistema
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
    const { 
      domain, 
      webhook_url,
      notification_email,
      notifications_enabled,
      session_timeout,
      dark_theme
    } = await req.json()
    
    // Em desenvolvimento, simular resposta
    if (process.env.NODE_ENV === 'development') {
      console.log('Atualizando configurações (simulação):', {
        domain,
        webhook_url,
        notification_email,
        notifications_enabled,
        session_timeout,
        dark_theme
      })
      
      return NextResponse.json({
        success: true,
        message: 'Configurações atualizadas com sucesso (simulação)'
      })
    }
    
    // Usar configurações do Supabase já definidas no backend
    const supabaseUrl = supabaseConfig.url;
    const supabaseKey = supabaseConfig.serviceKey;
    
    // Atualizar configurações
    const result = await updateSystemSettings(supabaseUrl, supabaseKey, {
      domain,
      webhook_url,
      notification_email,
      notifications_enabled,
      session_timeout,
      dark_theme
    })
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar a requisição' }, 
      { status: 500 }
    )
  }
} 