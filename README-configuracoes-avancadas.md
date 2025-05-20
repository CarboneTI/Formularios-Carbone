# Configurações Avançadas de Acesso a Formulários

Este documento descreve as novas funcionalidades implementadas para permitir controle de acesso granular aos formulários do sistema.

## Visão Geral

O sistema agora possui um mecanismo que permite aos administradores configurar quais formulários são públicos (acessíveis sem login) e quais requerem autenticação. Isso proporciona maior flexibilidade para decidir quais recursos estarão disponíveis para usuários anônimos.

## Funcionalidades Implementadas

1. **Nova tabela `form_settings`**:
   - Armazena configurações para cada formulário
   - Permite definir se um formulário é público, requer autenticação ou está desativado

2. **Página de Configurações Avançadas**:
   - Acessível em `/dashboard/configuracoes-avancadas`
   - Interface para gerenciar as permissões de cada formulário
   - Restrita a usuários com papel de ADMIN

3. **Hook `useFormAccess`**:
   - Verifica se um usuário tem permissão para acessar um formulário
   - Retorna informações sobre o estado de acesso (público, requer autenticação, etc.)

4. **Middleware de proteção de rotas**:
   - Verifica permissões de acesso para cada rota de formulário
   - Redireciona usuários sem permissão para a página de login

## Opções de Configuração

Para cada formulário, é possível configurar:

- **Público**: Se ativado, o formulário pode ser acessado sem estar logado no sistema.
- **Requer Autenticação**: Mesmo que seja público, ainda requer que o usuário esteja autenticado para acessar. Esta opção só funciona se o formulário for marcado como público.
- **Ativo**: Se desativado, o formulário não ficará disponível para nenhum usuário, independentemente das outras configurações.

## Tipos de Usuários e Permissões

O sistema utiliza três tipos principais de usuários:

1. **ADMIN (Administrador)**:
   - Acesso total ao sistema
   - Pode configurar permissões de formulários
   - Pode gerenciar todos os usuários

2. **MANAGER (Gerente)**:
   - Acesso intermediário
   - Pode visualizar relatórios e configurações básicas
   - Não pode acessar configurações avançadas

3. **USER (Usuário)**:
   - Acesso básico
   - Pode preencher formulários
   - Acesso limitado ao dashboard

## Como Funciona o Controle de Acesso

O controle de acesso é implementado em três níveis:

1. **Nível de Middleware**:
   - Intercepta todas as requisições para rotas de formulários
   - Verifica as configurações do formulário no banco de dados
   - Redireciona para a página de login quando necessário

2. **Nível de Componente**:
   - Usa o hook `useFormAccess` para verificar permissões
   - Renderiza diferentes UIs com base no estado de acesso
   - Mostra mensagens adequadas para usuários sem permissão

3. **Nível de API**:
   - Verificações adicionais nas APIs que processam submissões de formulários
   - Garante que mesmo chamadas diretas à API respeitem as configurações de acesso

## Como Testar

Para testar o controle de acesso:

1. Faça login como administrador (admin@carbonecompany.com / admin123)
2. Acesse `/dashboard/configuracoes-avancadas`
3. Configure diferentes formulários com várias combinações de acesso
4. Teste o acesso em diferentes estados (logado, deslogado)
5. Verifique se as restrições estão sendo aplicadas corretamente

## Problemas Conhecidos

- A criação de usuários está atualmente armazenando-os apenas na tabela `users` personalizada, mas não no sistema de autenticação nativo do Supabase.
- É necessário ajustar o código de cadastro de usuários para garantir que todos os usuários sejam inseridos na tabela `users` e registrados no sistema de autenticação do Supabase.

## Próximos Passos

- Implementar sincronização bidirecional entre a tabela `users` e o sistema de autenticação do Supabase
- Adicionar registro de logs para tentativas de acesso a formulários restritos
- Implementar um sistema de convites para formulários privados 