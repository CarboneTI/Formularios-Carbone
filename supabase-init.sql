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

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS "users" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS "clients" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  clickup_task_id TEXT UNIQUE NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tipos enumerados
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_type') THEN
    CREATE TYPE form_type AS ENUM (
      'SAC_EXTRA', 
      'SAC_PLANEJAMENTO', 
      'SAC_FILMMAKERS_DECUPAGEM', 
      'SAC_FILMMAKERS_GRAVACAO',
      'PROMPT_CREATION'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE submission_status AS ENUM (
      'PENDING',
      'PROCESSED',
      'ERROR'
    );
  END IF;
END
$$;

-- Tabela de submissões de formulários
CREATE TABLE IF NOT EXISTS "form_submissions" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type TEXT NOT NULL,
  data JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  submitted_by_id UUID,
  submitted_by_name TEXT,
  submitted_by_email TEXT,
  client_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (submitted_by_id) REFERENCES users(id),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Tabela de webhooks
CREATE TABLE IF NOT EXISTS "webhooks" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_type TEXT NOT NULL,
  url TEXT NOT NULL,
  headers JSONB,
  enabled BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;
CREATE TRIGGER update_webhooks_updated_at
BEFORE UPDATE ON webhooks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de resultados de webhooks
CREATE TABLE IF NOT EXISTS "webhook_results" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  success BOOLEAN NOT NULL,
  status INTEGER,
  status_text TEXT,
  response_data TEXT,
  error TEXT,
  webhook_id UUID NOT NULL,
  form_submission_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (webhook_id) REFERENCES webhooks(id),
  FOREIGN KEY (form_submission_id) REFERENCES form_submissions(id)
);

-- Tabela de tokens de autenticação
CREATE TABLE IF NOT EXISTS "auth_tokens" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS "system_settings" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de listas do ClickUp
CREATE TABLE IF NOT EXISTS "clickup_lists" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_clickup_lists_updated_at ON clickup_lists;
CREATE TRIGGER update_clickup_lists_updated_at
BEFORE UPDATE ON clickup_lists
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS "audit_logs" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  user_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Inserir usuário admin padrão
INSERT INTO users (email, name, password_hash, role)
VALUES (
  'admin@carbonecompany.com',
  'Administrador',
  '$2a$10$GYiXYmFEq2igX8WzMdgG8.AcCMnSZJCwQEBJ4mKCcDKxV/fKK2Jf.',  -- Senha: admin123 (hash bcrypt)
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Inserir configurações padrão
INSERT INTO system_settings (key, value, description)
VALUES 
  ('domain', 'app.carbonecompany.com', 'Domínio da aplicação'),
  ('webhook_url', 'https://autogrowth.cabonesolucoes.com.br/webhook/b1551055-3ebb-4a94-8aea-89488772d8ff-unico', 'URL do webhook principal'),
  ('notification_email', 'admin@carbonecompany.com', 'Email para notificações'),
  ('notifications_enabled', 'true', 'Notificações por email ativadas'),
  ('session_timeout', '60', 'Tempo de sessão em minutos'),
  ('dark_theme', 'true', 'Tema escuro ativado')
ON CONFLICT (key) DO NOTHING;

-- Inserir listas do ClickUp
INSERT INTO clickup_lists (id, name, description)
VALUES
  ('901307269821', 'audiovisual', 'Lista de audiovisual'),
  ('901306484052', 'design', 'Lista de design'),
  ('901307269583', 'tráfego', 'Lista de tráfego'),
  ('901307269834', 'CS', 'Lista de CS'),
  ('901307269808', 'Gerência', 'Lista de Gerência'),
  ('901307269881', 'SAC', 'Lista de SAC'),
  ('901307455235', 'Social media', 'Lista de Social media')
ON CONFLICT (id) DO NOTHING; 