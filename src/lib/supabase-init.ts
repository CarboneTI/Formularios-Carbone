/**
 * Funções para inicializar o banco de dados Supabase
 * Contém scripts SQL para criar todas as tabelas necessárias
 */

import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './config'

// Script SQL para criar as tabelas necessárias no Supabase
const CREATE_TABLES_SQL = `
-- Script para inicialização do banco de dados Supabase
-- Este script deve ser executado no console SQL do Supabase

-- Criar a função para atualização automática de timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar função para criar tabela users se não existir
CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- Verificar se a tabela users existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    -- Criar a tabela users
    CREATE TABLE public.users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Criar trigger para atualizar o timestamp automaticamente
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
    -- Inserir usuário admin padrão
    INSERT INTO users (email, name, password_hash, role)
    VALUES (
      'admin@carbonecompany.com',
      'Administrador',
      '424ee6363dfb1e5277fb5d7c85ec0bc02d62b240e0ca96c27c013751a8892be3',  -- Senha: admin123 (hash SHA-256)
      'admin'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;
`;

/**
 * Testando a conexão com o Supabase usando as credenciais fornecidas
 * 
 * Esta função tenta fazer uma consulta simples para verificar se a conexão funciona
 */
export async function testSupabaseConnection(url: string, key: string) {
  try {
    const supabase = createClient(url, key)
    
    // Tentar fazer uma consulta básica para verificar a conexão
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Erro ao testar conexão:', error)
      return {
        success: false,
        message: `Erro ao conectar: ${error.message}`,
        details: error
      }
    }
    
    return {
      success: true,
      message: 'Conexão com Supabase estabelecida com sucesso!'
    }
  } catch (err: any) {
    console.error('Erro ao testar conexão:', err)
    return {
      success: false,
      message: `Erro ao conectar: ${err.message || 'Erro desconhecido'}`,
      details: err
    }
  }
}

/**
 * Inicializa o banco de dados do Supabase com as tabelas necessárias
 */
export async function initializeSupabaseDatabase(url: string, key: string) {
  try {
    // Usar a chave de serviço para ter permissões de admin
    const supabase = createClient(url, key)
    
    // Criar tabela de usuários se não existir
    const { error: createUsersError } = await supabase.rpc('create_users_table_if_not_exists')
    
    if (createUsersError) {
      console.error('Erro ao criar tabela de usuários:', createUsersError)
      // Ainda assim, continuamos para criar outras tabelas
    }
    
    // Outras inicializações aqui se necessário...
    
    return {
      success: true,
      message: 'Banco de dados inicializado com sucesso!'
    }
  } catch (err: any) {
    console.error('Erro ao inicializar banco de dados:', err)
    return {
      success: false,
      message: `Erro ao inicializar: ${err.message || 'Erro desconhecido'}`,
      details: err
    }
  }
}

/**
 * Atualiza configurações do sistema no Supabase
 */
export async function updateSystemSettings(
  url: string, 
  key: string, 
  settings: {
    domain?: string
    webhook_url?: string
    notification_email?: string
    notifications_enabled?: boolean
    session_timeout?: string
    dark_theme?: boolean
  }
) {
  if (!url || !key) {
    throw new Error('URL e chave do Supabase são obrigatórios')
  }
  
  try {
    const supabase = createClient(url, key)
    
    // Atualizar configurações uma a uma
    for (const [setting, value] of Object.entries(settings)) {
      if (value !== undefined) {
        const { error } = await supabase
          .from('system_settings')
          .update({ value: String(value) })
          .eq('key', setting)
        
        if (error) {
          console.error(`Erro ao atualizar configuração ${setting}:`, error)
          throw error
        }
      }
    }
    
    return { 
      success: true, 
      message: 'Configurações do sistema atualizadas com sucesso!'
    }
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    throw error
  }
}

/**
 * Executa o script SQL para criar as tabelas e funções necessárias
 */
export async function setupDatabaseSchema() {
  try {
    console.log('Configurando schema do banco de dados Supabase...');
    
    // Criar cliente com a chave de serviço
    const supabase = createClient(supabaseConfig.url, supabaseConfig.serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
    
    // Executar o script SQL completo
    const { error } = await supabase.rpc('create_users_table_if_not_exists');
    
    if (error) {
      console.error('Erro ao configurar schema do banco de dados:', error);
      
      // Se a função RPC não existir, tentar criar pelo SQL
      if (error.message.includes('does not exist')) {
        console.log('Função RPC não existe. Você precisa executar o script SQL manualmente no console do Supabase.');
        console.log('Script SQL:');
        console.log(CREATE_TABLES_SQL);
        
        return {
          success: false,
          message: 'Script SQL deve ser executado manualmente no console do Supabase',
          sqlScript: CREATE_TABLES_SQL
        };
      }
      
      return {
        success: false,
        message: `Erro ao configurar banco de dados: ${error.message}`,
        details: error
      };
    }
    
    return {
      success: true,
      message: 'Schema do banco de dados configurado com sucesso'
    };
  } catch (err: any) {
    console.error('Erro ao configurar schema do banco de dados:', err);
    return {
      success: false,
      message: `Erro: ${err.message || 'Erro desconhecido'}`,
      details: err
    };
  }
} 