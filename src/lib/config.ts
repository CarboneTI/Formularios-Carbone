/**
 * Arquivo de configuração centralizada
 * Armazena todas as credenciais e parâmetros de conexão para APIs externas
 */

// API connection helper functions
import { createClient } from '@supabase/supabase-js'

// Test user credentials for development
export const testCredentials = {
  admin: {
    email: 'admin@carbonecompany.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  }
}

// Configurações fixas do Supabase para o backend
// ATENÇÃO: Em uma aplicação real, isso deveria estar em variáveis de ambiente no servidor
export const supabaseConfig = {
  url: 'https://dzhscmihztgwtmiqidjy.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHNjbWloenRnd3RtaXFpZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDUxMzgsImV4cCI6MjA2MTUyMTEzOH0.ectLn2ZUb0wA2RrbXDN-fj9_mWkWMddRqWRHo27uMI0',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aHNjbWloenRnd3RtaXFpZGp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDU4MDI3OCwiZXhwIjoyMDMwMTU2Mjc4fQ.VdhQWGCLGlkIVSWcT1qGm8UEJdLovYbH0c7I3bautGU'
}

// Log de informação da chave para debug (apenas comprimento)
function logKeyInfo(key: string) {
  if (key) {
    console.log(`Key length: ${key.length}, starts with: ${key.substring(0, 10)}...`);
  } else {
    console.log('Key is empty or undefined!');
  }
  return key;
}

// Determina se devemos usar o sistema de autenticação local ou real
// Define como false (usar Supabase real) para produção 
// Define como true (usar mock) para desenvolvimento ou testes
export const USE_LOCAL_AUTH = true; // ALTERE AQUI: true para mock, false para Supabase real

// Importado depois das constantes para evitar referência circular
import { createMockClient } from './mock-auth'

/**
 * Retorna um cliente Supabase com permissões de admin usando a service role key
 */
export function getSupabaseAdminClient() {
  console.log('Creating admin client');
  
  if (USE_LOCAL_AUTH) {
    console.log('Using LOCAL authentication system (mock admin client)');
    return createMockClient();
  }
  
  return createClient(supabaseConfig.url, logKeyInfo(supabaseConfig.serviceKey), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Retorna um cliente Supabase normal para uso no lado do cliente
 */
export function getSupabaseClient() {
  if (USE_LOCAL_AUTH) {
    console.log('Using LOCAL authentication system (mock client)');
    return createMockClient();
  }
  
  return createClient(supabaseConfig.url, supabaseConfig.anonKey)
} 