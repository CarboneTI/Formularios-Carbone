import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// URLs que estão sempre acessíveis sem autenticação
const PUBLIC_URLS = [
  '/',
  '/login',
  '/api/auth',
  '/api/admin/supabase-config',
  '/assets',
  '/favicon.ico',
  '/_next'
]

// URLs do dashboard que sempre exigem autenticação
const DASHBOARD_URLS = [
  '/dashboard'
]

// Supabase client para o middleware
const supabaseUrl = 'https://dzhscmihztgwtmiqidjy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHNjbWloenRnd3RtaXFpZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ1ODAyNzgsImV4cCI6MjAzMDE1NjI3OH0.0AsUhH27yLhh9OKy9Fohs5-U4JGKhZcLiU6qLdsaLyY'

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Verificando acesso para: ${request.nextUrl.pathname}`);
  
  // Inicializar o cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })

  // Pegar a URL atual
  const { pathname } = request.nextUrl

  // Para arquivos estáticos e URLs sempre públicas, permitir acesso
  if (PUBLIC_URLS.some(url => pathname.startsWith(url))) {
    console.log(`[Middleware] Acesso permitido para URL pública: ${pathname}`);
    return NextResponse.next()
  }

  // Para URLs do dashboard, sempre exigir autenticação
  if (DASHBOARD_URLS.some(url => pathname.startsWith(url))) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log(`[Middleware] Verificação de sessão para dashboard: ${session ? 'Sessão válida' : 'Sem sessão'}`);
      
      if (!session) {
        console.log(`[Middleware] Redirecionando para login: usuário não autenticado`);
        const url = new URL('/', request.url)
        return NextResponse.redirect(url)
      }
      
      console.log(`[Middleware] Acesso ao dashboard permitido para usuário autenticado`);
      return NextResponse.next()
    } catch (error) {
      console.error(`[Middleware] Erro ao verificar sessão:`, error);
      // Em caso de erro na verificação, redirecionar para login
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }
  }

  // Para URLs de formulários, verificar as configurações do formulário
  if (pathname.startsWith('/formularios/')) {
    // Extrair o ID do formulário da URL
    const formId = pathname.split('/').pop()
    
    if (formId) {
      try {
        // Verificar as configurações do formulário
        const { data: formSettings, error } = await supabase
          .from('form_settings')
          .select('*')
          .eq('form_id', formId)
          .single()
        
        if (error) {
          console.error('[Middleware] Erro ao verificar configurações do formulário:', error)
          return NextResponse.next() // Em caso de erro, permitir acesso
        }
        
        // Se o formulário não estiver ativo, redirecionar para a página inicial
        if (formSettings && !formSettings.enabled) {
          console.log(`[Middleware] Formulário desativado: ${formId}`);
          const url = new URL('/dashboard', request.url)
          return NextResponse.redirect(url)
        }
        
        console.log(`[Middleware] Acesso ao formulário permitido: ${formId}`);
        // Permitir acesso ao formulário independente de outras configurações
        return NextResponse.next()
      } catch (err) {
        console.error('[Middleware] Erro no middleware:', err)
        return NextResponse.next() // Em caso de exceção, permitir acesso
      }
    }
  }
  
  // Para qualquer outra URL, permitir acesso
  console.log(`[Middleware] Acesso permitido para URL não categorizadas: ${pathname}`);
  return NextResponse.next()
}

export const config = {
  // Aplicar apenas nas rotas especificadas
  matcher: ['/', '/dashboard/:path*', '/prompts/:path*', '/formularios/:path*'],
} 