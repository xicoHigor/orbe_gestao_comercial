# Orbe Comercial

Sistema web responsivo para vendas e gestão comercial. Interface em português do Brasil, valores em reais e datas no fuso `America/Sao_Paulo`.

## Requisitos

- Node.js 22.5 ou superior (usa o módulo SQLite incluído no Node).
- npm.

## Executar localmente

1. Copie `.env.example` para `.env` e ajuste as configurações. No PowerShell: `Copy-Item .env.example .env`.
2. Instale as dependências: `npm install`.
3. Inicie interface e API: `npm run dev`.
4. Abra `http://localhost:5173`.

Para gerar a versão de produção, execute `npm run build` e depois `npm start`. O banco é criado automaticamente em `data/comercial.sqlite`, ou no caminho de `DATABASE_PATH`. Preserve e faça cópias desse arquivo para manter os dados.

## Aplicativo para Windows (.exe)

Execute `npm install` e depois `npm run desktop:build`. Os arquivos serão criados na pasta `release`. O aplicativo desktop guarda o banco em `%APPDATA%\\Orbe Comercial\\comercial.sqlite`, separado do banco usado pela versão web.

## Funcionalidades

- Sessões seguras, logout, recuperação de senha e papéis de administrador, gerente e vendedor.
- Painel com vendas, pedidos em aberto, ticket médio, metas, alertas de estoque e tarefas.
- Cadastro e pesquisa de clientes.
- Produtos, custos, preços, categorias, estoque mínimo e histórico de movimentações.
- Oportunidades comerciais com etapas e acompanhamentos.
- Orçamentos com vários produtos, descontos, aprovação e impressão.
- Conversão de orçamento em pedido, parcelas e acompanhamento de pagamentos e entregas.
- Metas mensais, comissões, relatórios e exportação CSV.
- Contas a receber, registro de auditoria e backup do banco pela interface.

## Segurança e dados

Senhas usam `scrypt`; sessões usam cookies `HttpOnly` e `SameSite=Lax`, com `Secure` em produção. Tokens de sessão e recuperação são armazenados como hash. A API valida permissões e recalcula valores de cobrança e estoque no servidor.

**Antes de usar em produção:** configure HTTPS e SMTP; substitua/desative contas demonstrativas e senhas padrão; mantenha segredos apenas no arquivo `.env` e nunca os publique. O arquivo `.env` e o banco local são ignorados pelo Git. Consulte [docs/AUTENTICACAO.md](docs/AUTENTICACAO.md) para detalhes do fluxo de autenticação e recomendações.

## Verificação

```sh
npm test
npm run build
```
