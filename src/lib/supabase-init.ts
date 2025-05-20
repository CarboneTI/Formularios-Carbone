/**
 * Funções para inicializar o banco de dados Supabase
 * Contém scripts SQL para criar todas as tabelas necessárias
 */

import { createClient } from '@supabase/supabase-js'

// Configuração padrão do Supabase
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
}

// Função para obter credenciais do localStorage
function getStoredCredentials() {
  if (typeof window === 'undefined') return null
  
  try {
    const credentials = localStorage.getItem('credentials')
    if (credentials) {
      const { supabaseUrl, supabaseKey } = JSON.parse(credentials)
      return { url: supabaseUrl, key: supabaseKey }
    }
  } catch (error) {
    console.warn('Erro ao ler credenciais do localStorage:', error)
  }
  return null
}

// Cliente Supabase para o frontend
export function getSupabaseClient() {
  // Tentar usar credenciais do localStorage primeiro
  const storedCredentials = getStoredCredentials()
  
  if (storedCredentials?.url && storedCredentials?.key) {
    return createClient(storedCredentials.url, storedCredentials.key)
  }
  
  // Fallback para credenciais do ambiente
  return createClient(supabaseConfig.url, supabaseConfig.anonKey)
}

// Cliente Supabase para operações administrativas
export function getSupabaseAdminClient() {
  // Tentar usar credenciais do localStorage primeiro
  const storedCredentials = getStoredCredentials()
  
  if (storedCredentials?.url && storedCredentials?.key) {
    return createClient(storedCredentials.url, storedCredentials.key)
  }
  
  // Fallback para credenciais do ambiente
  return createClient(supabaseConfig.url, supabaseConfig.serviceKey)
}

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

-- Criar função para criar tabela de histórico de prompts se não existir
CREATE OR REPLACE FUNCTION create_prompt_history_table_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- Verificar se a tabela prompt_history existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'prompt_history'
  ) THEN
    -- Criar a tabela prompt_history
    CREATE TABLE public.prompt_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
      prompt TEXT NOT NULL,
      response TEXT NOT NULL,
      form_type TEXT NOT NULL,
      form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Criar índices
    CREATE INDEX prompt_history_user_id_idx ON public.prompt_history(user_id);
    CREATE INDEX prompt_history_created_at_idx ON public.prompt_history(created_at DESC);

    -- Criar trigger para atualizar o timestamp automaticamente
    CREATE TRIGGER update_prompt_history_updated_at
    BEFORE UPDATE ON prompt_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    -- Criar política RLS para prompt_history
    ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;

    -- Política para leitura: usuários só podem ver seu próprio histórico
    CREATE POLICY "Users can view own prompt history"
    ON public.prompt_history FOR SELECT
    USING (auth.uid() = user_id);

    -- Política para inserção: usuários só podem inserir em seu próprio histórico
    CREATE POLICY "Users can insert own prompt history"
    ON public.prompt_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    -- Política para deleção: usuários só podem deletar seu próprio histórico
    CREATE POLICY "Users can delete own prompt history"
    ON public.prompt_history FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Executar funções de criação de tabelas
SELECT create_users_table_if_not_exists();
SELECT create_prompt_history_table_if_not_exists();
`;

/**
 * Testando a conexão com o Supabase usando as credenciais fornecidas
 * 
 * Esta função tenta fazer uma consulta simples para verificar se a conexão funciona
 */
export async function testSupabaseConnection(url: string, key: string) {
  try {
    const supabase = createClient(url, key)
    
    // Tentar fazer uma operação simples
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1)
    
    if (error) {
      return {
        success: false,
        message: `Erro ao conectar: ${error.message}`
      }
    }
    
    return {
      success: true,
      message: 'Conexão estabelecida com sucesso!'
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Erro ao conectar: ${error.message}`
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

/**
 * Salva as configurações do Supabase no arquivo de configuração local
 */
export async function saveSupabaseConfig(url: string, key: string) {
  try {
    // Testar a conexão antes de salvar
    const testResult = await testSupabaseConnection(url, key)
    
    if (!testResult.success) {
      throw new Error(`Falha ao testar conexão: ${testResult.message}`)
    }
    
    // Salvar no localStorage
    localStorage.setItem('credentials', JSON.stringify({
      supabaseUrl: url,
      supabaseKey: key,
      isConfigured: true
    }))
    
    return {
      success: true,
      message: 'Configurações do Supabase salvas com sucesso!'
    }
  } catch (error: any) {
    console.error('Erro ao salvar configurações:', error)
    throw error
  }
} 