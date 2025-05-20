# Central de Controle Carbone

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
├── src/                    # Código fonte principal
│   ├── app/               # Rotas e páginas da aplicação
│   ├── components/        # Componentes React reutilizáveis
│   └── lib/              # Utilitários e configurações
├── public/               # Arquivos estáticos
├── prisma/              # Configurações e modelos do Prisma
├── nginx/               # Configurações do servidor web
├── .local-data/         # Dados locais para desenvolvimento
└── [arquivos de configuração]
```

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

### Requisitos do Sistema
- CPU: 2 cores ou mais
- RAM: 4GB ou mais
- Disco: 20GB SSD
- Sistema: Ubuntu 20.04 LTS ou superior

### Preparação do Ambiente
1. Instalação do Docker e Docker Compose
2. Configuração do domínio e SSL
3. Configuração das variáveis de ambiente
4. Configuração do Nginx

### Processo de Deploy
1. Conecte o repositório ao Coolify
2. Configure o pipeline de CI/CD
3. O sistema será construído e implantado automaticamente

### Manutenção
- Atualizações regulares
- Backups automáticos
- Renovação de certificados SSL
- Monitoramento de logs

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
