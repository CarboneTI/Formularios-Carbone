# Central de Controle Carbone

## 👥 Equipe
- **Desenvolvedor Chefe**: Cainan Neves Maia
- **Empresa**: Carbone Company

## 📋 Sobre o Projeto
Sistema web interno para gerenciamento e controle de operações da Carbone Company. O sistema oferece uma interface moderna e segura para a equipe interna, com recursos de autenticação, gerenciamento de usuários e formulários dinâmicos.

## 🚀 Tecnologias Utilizadas
- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Autenticação**: Supabase Auth (com opção de autenticação local)
- **Banco de Dados**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Gerenciamento de Estado**: Zustand, React Query
- **Validação de Formulários**: React Hook Form, Zod
- **Containerização**: Docker
- **Hospedagem**: Coolify

## 📦 Estrutura do Projeto
```
central-carbone/
├── src/                      # Código fonte principal
│   ├── app/                 # Rotas e páginas da aplicação (Next.js 14 App Router)
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── forms/          # Componentes específicos de formulários
│   │   └── ...            # Outros componentes
│   ├── hooks/              # Hooks personalizados (usePromptHistory, useLocalStorage, etc)
│   ├── lib/               # Utilitários e configurações
│   │   ├── schemas/      # Schemas de validação (Zod)
│   │   ├── mock-auth/   # Sistema de autenticação local
│   │   └── ...         # Outras utilidades
│   ├── config/          # Configurações do sistema
│   ├── contexts/        # Contextos React
│   ├── middleware/      # Middlewares da aplicação
│   ├── scripts/         # Scripts utilitários
│   └── generated/       # Arquivos gerados automaticamente
├── public/             # Arquivos estáticos
├── prisma/            # Configurações e modelos do Prisma
├── nginx/             # Configurações do servidor web
├── .local-data/       # Dados locais para desenvolvimento
├── docker-compose.yml # Configuração do Docker Compose
├── Dockerfile        # Configuração do container
└── [arquivos de configuração]
```

### Principais Arquivos
- `supabase-init.sql`: Scripts de inicialização do banco de dados
- `start-local.js`: Script para execução local
- `middleware.ts`: Configuração de middlewares globais
- `next.config.js`: Configuração do Next.js
- `tailwind.config.js`: Configuração do Tailwind CSS

## 🔧 Instalação e Execução

### Requisitos
- Node.js 18+
- Docker (opcional)
- Conta no Supabase
- Conta no Coolify (para deploy)

### Configuração do Ambiente de Desenvolvimento
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env`
   - Preencha as variáveis necessárias

### Executando o Projeto
1. Modo de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Modo com autenticação local:
   ```bash
   npm run local-auth
   ```

## 🔐 Autenticação

### Autenticação Supabase
- Sistema principal de autenticação
- Integração com banco de dados PostgreSQL
- Gerenciamento de sessões seguro

### Autenticação Local
- Disponível para desenvolvimento e situações offline
- Usuários padrão:
  - Admin: admin@carbonecompany.com / admin123
  - Gerente: gerente@carbonecompany.com / gerente123
  - Usuário: usuario@carbonecompany.com / usuario123

## ⚙️ Configurações Avançadas

### Níveis de Acesso

#### 1. Administrador (ADMIN)
- Acesso total ao sistema
- Gerenciamento de usuários
- Configuração de permissões
- Acesso a relatórios avançados

#### 2. Gerente (MANAGER)
- Acesso intermediário
- Visualização de relatórios
- Configurações básicas
- Gerenciamento de equipe

#### 3. Usuário (USER)
- Acesso básico
- Preenchimento de formulários
- Dashboard simplificado
- Relatórios pessoais

### Gerenciamento de Formulários
- Configuração de acesso público/privado
- Controle de permissões por tipo de usuário
- Sistema de ativação/desativação de formulários

### Sistema de Permissões
- Hook `useFormAccess` para verificação de permissões
- Middleware de proteção de rotas
- Validação em múltiplas camadas

## 🚢 Deploy

### Infraestrutura
- **VPS**: DigitalOcean Droplet
- **Gerenciamento**: Coolify
- **Proxy Reverso**: Nginx

### Requisitos do Sistema
- CPU: 2 cores ou mais
- RAM: 4GB ou mais
- Disco: 20GB SSD
- Sistema: Ubuntu 20.04 LTS ou superior
- Droplet Basic da DigitalOcean (ou superior)

### Preparação do Ambiente
1. Criar Droplet na DigitalOcean:
   - Escolher Ubuntu 20.04 LTS
   - Selecionar plano Basic com recursos adequados
   - Configurar acesso SSH
2. Instalar e configurar Coolify no Droplet
3. Configurar domínio e SSL
4. Configurar variáveis de ambiente
5. Configurar Nginx como proxy reverso

### Processo de Deploy
1. Conecte o repositório ao Coolify
2. Configure o pipeline de CI/CD
3. O sistema será construído e implantado automaticamente no Droplet

### Manutenção
- Atualizações regulares do sistema
- Backups automáticos via DigitalOcean
- Renovação automática de certificados SSL
- Monitoramento de recursos via Coolify
- Logs centralizados

## 🔒 Segurança

### Recomendações
1. Mantenha o sistema atualizado
2. Use senhas fortes
3. Configure firewalls
4. Monitore logs de acesso
5. Faça backups regulares

### Implementações de Segurança
- Autenticação via Supabase
- Proteção de rotas
- Validação de dados
- Políticas de segurança no banco de dados
- Sanitização de inputs
- Proteção contra CSRF

## 🛠️ Troubleshooting

### Problemas Comuns

1. **Erro de SSL**:
   - Verifique os certificados
   - Confirme as permissões
   - Verifique a configuração do Nginx

2. **Erro de Conexão Supabase**:
   - Verifique as variáveis de ambiente
   - Teste a conectividade
   - Verifique as políticas de segurança

3. **Erro de Email**:
   - Verifique as credenciais do Gmail
   - Confirme a senha de app
   - Verifique os logs de envio

### Logs e Diagnóstico
```bash
# Logs da aplicação
docker-compose logs app

# Logs do Nginx
docker-compose logs nginx

# Status dos contêineres
docker-compose ps

# Uso de recursos
docker stats
```

## 📊 Funcionalidades Principais
- [x] Sistema de autenticação
- [x] Gerenciamento de usuários
- [x] Formulários dinâmicos
- [x] Dashboard administrativo
- [x] Relatórios e métricas
- [ ] Integração com sistemas externos

## 🔄 Próximas Implementações

### Curto Prazo
- Sincronização bidirecional de usuários
- Sistema de logs de acesso
- Melhorias na interface administrativa

### Médio Prazo
- Sistema de convites
- Relatórios avançados
- API para integrações

### Longo Prazo
- Integração com sistemas externos
- Automação de processos
- Análise preditiva

## 🤝 Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

### Contatos
- Suporte Técnico: ti@carbonecompany.com.br

## 📄 Licença
Este projeto é proprietário e confidencial. Todos os direitos reservados à Carbone Company.

## Design System

### Cores
```css
/* Cores Principais */
--color-primary: #FFC600;      /* Amarelo principal */
--color-primary-hover: #FFD700; /* Amarelo hover */
--color-background: #0F1117;    /* Fundo escuro */
--color-surface: rgba(17, 17, 17, 0.7); /* Superfícies/Cards */
--color-border: rgba(255, 255, 255, 0.05); /* Bordas */

/* Texto */
--color-text: #FFFFFF;          /* Texto principal */
--color-text-secondary: rgba(255, 255, 255, 0.7); /* Texto secundário */
--color-text-tertiary: rgba(255, 255, 255, 0.5);  /* Texto terciário */
```

### Tipografia
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
- **Tamanhos**:
  - Títulos grandes: 24px (1.5rem)
  - Títulos médios: 20px (1.25rem)
  - Texto padrão: 16px (1rem)
  - Texto pequeno: 14px (0.875rem)

### Sombras
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Componentes

#### Botões
- **Primário**: Fundo amarelo (#FFC600) com texto preto
- **Secundário**: Fundo cinza escuro com texto branco
- **Hover**: Transição suave de cores
- **Desabilitado**: Opacidade reduzida (50%)

#### Formulários
- **Inputs**: Fundo escuro semi-transparente com borda
- **Focus**: Anel de foco amarelo
- **Hover**: Borda amarela
- **Labels**: Texto amarelo, fonte média

#### Cards
- Fundo semi-transparente (rgba(17, 17, 17, 0.7))
- Borda sutil (rgba(255, 255, 255, 0.05))
- Backdrop blur para efeito de vidro
- Cantos arredondados (border-radius: 8px)

#### Dropdowns
- Menu com fundo escuro semi-transparente
- Efeito de blur no background
- Itens com hover suave
- Indicador amarelo para item selecionado

### Transições e Animações
```css
--transition-base: all 0.2s ease;
```
- Transições suaves em interações
- Feedback visual em hover/focus
- Animações sutis para loading e estados

### Acessibilidade
- Alto contraste entre texto e fundo
- Focus visível em todos elementos interativos
- Tamanhos mínimos para áreas clicáveis
- Feedback visual claro para estados

## Instalação e Uso
[Instruções de instalação e uso aqui...]

## Padrões de Desenvolvimento

### Estrutura Padrão de Formulários

#### 1. Estrutura de Arquivos
```
src/
├── components/forms/
│   ├── [NomeFormulario]/
│   │   ├── index.tsx              # Componente principal do formulário
│   │   ├── schema.ts              # Schema de validação Zod
│   │   ├── types.ts               # Types e interfaces
│   │   └── components/            # Componentes específicos do formulário
│   │       ├── FormHeader.tsx     # Cabeçalho do formulário
│   │       ├── FormFields.tsx     # Campos do formulário
│   │       └── FormActions.tsx    # Botões e ações
```

#### 2. Estrutura do Componente Principal
```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSchema } from './schema'
import { FormContainer } from '@/components/ui/form-container'
import { FormHeader } from './components/FormHeader'
import { FormFields } from './components/FormFields'
import { FormActions } from './components/FormActions'

export default function NomeFormulario() {
  // 1. Estados e Hooks
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // 2. Configuração do React Hook Form
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // valores iniciais aqui
    }
  })

  // 3. Handler de Submit
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setSubmitError('')
      
      // Lógica de submit aqui
      
      setSubmitSuccess(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // 4. Estrutura JSX
  return (
    <FormContainer>
      {/* Cabeçalho com título e descrição */}
      <FormHeader 
        title="Título do Formulário"
        description="Descrição ou instruções do formulário"
      />

      {/* Formulário */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Campos do formulário */}
        <FormFields form={form} />

        {/* Mensagens de feedback */}
        {submitError && (
          <div className="alert alert-error" role="alert">
            {submitError}
          </div>
        )}
        
        {submitSuccess && (
          <div className="alert alert-success" role="alert">
            Formulário enviado com sucesso!
          </div>
        )}

        {/* Botões de ação */}
        <FormActions
          isSubmitting={isSubmitting}
          onCancel={() => {/* lógica de cancelamento */}}
        />
      </form>
    </FormContainer>
  )
}
```

#### 3. Elementos Obrigatórios

1. **Cabeçalho do Formulário**
   - Título claro e descritivo
   - Descrição ou instruções quando necessário
   - Breadcrumb para navegação (quando aplicável)

2. **Campos do Formulário**
   - Label descritivo
   - Indicador de campo obrigatório (*)
   - Mensagem de erro
   - Texto de ajuda (quando necessário)
   - Estado de loading/disabled
   - Feedback visual de validação

3. **Área de Ações**
   - Botão principal de submit
   - Botão secundário (cancelar/voltar)
   - Indicador de loading durante submit
   - Posicionamento consistente (direita para desktop, largura total para mobile)

4. **Feedback ao Usuário**
   - Mensagens de erro
   - Mensagens de sucesso
   - Indicadores de progresso (para formulários multi-step)
   - Estados de loading

#### 4. Estilos Padrão
```css
.form-container {
  @apply w-full max-w-4xl mx-auto p-6 space-y-8
         bg-gray-900/50 border border-gray-800 rounded-lg;
}

.form-header {
  @apply space-y-2 mb-8;
}

.form-title {
  @apply text-2xl font-semibold text-white;
}

.form-description {
  @apply text-gray-400;
}

.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-white;
}

.form-input {
  @apply w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
         focus:ring-2 focus:ring-primary focus:border-transparent;
}

.form-error {
  @apply text-sm text-red-500;
}

.form-actions {
  @apply flex flex-col sm:flex-row justify-end gap-4 mt-8;
}
```

#### 5. Checklist de Implementação

- [ ] Estrutura de arquivos correta
- [ ] Componente principal com estados necessários
- [ ] Schema de validação implementado
- [ ] Campos com labels e mensagens de erro
- [ ] Feedback visual de estados
- [ ] Botões de ação com estados corretos
- [ ] Estilos conforme design system
- [ ] Responsividade implementada
- [ ] Acessibilidade verificada
- [ ] Testes de validação realizados
