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

### Formulários

#### Estrutura Base
```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormSchema } from '@/lib/schemas/form-schema'

export default function FormularioExemplo() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // valores iniciais aqui
    }
  })

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <header>
        {/* Cabeçalho padrão */}
      </header>
      
      <main className="form-container">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Campos do formulário */}
        </form>
      </main>
    </div>
  )
}
```

#### Componentes Padrão

1. **FormField** - Campo base para inputs
```tsx
<FormField
  name="campo"
  label="Label do Campo"
  error={form.formState.errors.campo}
  required
>
  <input
    type="text"
    className="form-input"
    {...form.register('campo')}
  />
</FormField>
```

2. **DateTimePicker** - Seletor de data e hora
```tsx
<DateTimePicker
  label="Data e Hora"
  value={data}
  onChange={setData}
  required
/>
```

3. **Dropdown** - Menu suspenso personalizado
```tsx
<Dropdown
  label="Selecione uma opção"
  options={opcoes}
  value={selecionado}
  onChange={setSelecionado}
  required
/>
```

4. **FileUpload** - Upload de arquivos
```tsx
<FileUpload
  label="Anexar arquivo"
  accept=".pdf,.doc,.docx"
  maxSize={5} // MB
  onUpload={handleUpload}
/>
```

#### Validação

1. **Schema Zod**
```tsx
import { z } from 'zod'

export const FormSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  data: z.string().min(1, 'Data obrigatória'),
})
```

2. **Mensagens de Erro**
```tsx
{form.formState.errors.campo && (
  <span className="text-sm text-red-500">
    {form.formState.errors.campo.message}
  </span>
)}
```

#### Estados e Feedback

1. **Loading**
```tsx
<button 
  type="submit" 
  className="btn btn-primary"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <span className="animate-spin">...</span>
      Enviando...
    </>
  ) : (
    'Enviar'
  )}
</button>
```

2. **Sucesso**
```tsx
{submitSuccess && (
  <div className="alert alert-success">
    Formulário enviado com sucesso!
  </div>
)}
```

3. **Erro**
```tsx
{submitError && (
  <div className="alert alert-error">
    {submitError}
  </div>
)}
```

#### Layout e Espaçamento

1. **Container Principal**
```css
.form-container {
  @apply w-full max-w-4xl p-6 md:p-8 rounded-lg 
  bg-gray-900/50 border border-gray-800;
}
```

2. **Grupos de Campos**
```css
.form-group {
  @apply grid gap-6 md:grid-cols-2;
}
```

3. **Espaçamento entre Seções**
```css
.form-section {
  @apply space-y-6 pb-6 mb-6 border-b border-gray-800;
}
```

#### Boas Práticas

1. **Organização do Código**
   - Um componente por arquivo
   - Schemas em arquivos separados
   - Hooks personalizados para lógica complexa
   - Types/Interfaces em arquivos .d.ts

2. **Acessibilidade**
   - Labels descritivos
   - Atributos ARIA quando necessário
   - Ordem de tabulação lógica
   - Mensagens de erro claras
   - Feedback visual e sonoro

3. **Performance**
   - Lazy loading para componentes pesados
   - Debounce em inputs de busca
   - Otimização de re-renders
   - Memoização quando necessário

4. **Responsividade**
   - Mobile-first
   - Breakpoints consistentes
   - Adaptação de inputs para touch
   - Teclado virtual considerado

5. **Segurança**
   - Validação no cliente e servidor
   - Sanitização de inputs
   - Rate limiting
   - CSRF tokens
   - Proteção contra XSS

#### Fluxo de Desenvolvimento

1. **Planejamento**
   - Definir campos necessários
   - Criar schema de validação
   - Planejar layout e responsividade
   - Identificar componentes necessários

2. **Implementação**
   - Criar componente base
   - Implementar validação
   - Adicionar estados e feedback
   - Estilizar conforme design system

3. **Testes**
   - Validar todos os campos
   - Testar responsividade
   - Verificar acessibilidade
   - Testar casos de erro

4. **Revisão**
   - Code review
   - Teste de usabilidade
   - Verificação de performance
   - Validação de segurança

#### Exemplos de Uso

1. **Formulário Simples**
```tsx
export default function FormularioSimples() {
  const form = useForm({
    resolver: zodResolver(FormSchema)
  })

  return (
    <FormContainer>
      <FormField
        name="nome"
        label="Nome"
        error={form.formState.errors.nome}
        required
      >
        <input
          type="text"
          className="form-input"
          {...form.register('nome')}
        />
      </FormField>
      
      <FormActions>
        <Button type="submit">Enviar</Button>
      </FormActions>
    </FormContainer>
  )
}
```

2. **Formulário Multi-step**
```tsx
export default function FormularioMultiStep() {
  const [step, setStep] = useState(1)
  
  return (
    <FormContainer>
      <FormProgress step={step} totalSteps={3} />
      
      {step === 1 && <StepOne />}
      {step === 2 && <StepTwo />}
      {step === 3 && <StepThree />}
      
      <FormActions>
        {step > 1 && (
          <Button onClick={() => setStep(s => s - 1)}>
            Anterior
          </Button>
        )}
        <Button onClick={() => setStep(s => s + 1)}>
          {step === 3 ? 'Finalizar' : 'Próximo'}
        </Button>
      </FormActions>
    </FormContainer>
  )
}
```

#### Checklist de Implementação

- [ ] Schema de validação criado
- [ ] Componentes necessários importados
- [ ] Estados definidos
- [ ] Validação implementada
- [ ] Feedback visual adicionado
- [ ] Responsividade testada
- [ ] Acessibilidade verificada
- [ ] Segurança implementada
- [ ] Documentação atualizada
- [ ] Testes realizados
