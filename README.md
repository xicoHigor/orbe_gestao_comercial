# Orbe Comercial

Sistema web responsivo para vendas e gestão comercial. A interface está em português do Brasil e usa reais, datas brasileiras e fuso `America/Sao_Paulo`.

## Requisitos

- Node.js 22.5 ou superior (usa o módulo SQLite incluído no Node).
- npm.

## Executar localmente

1. Copie `.env.example` para `.env` e ajuste as configurações que desejar. No PowerShell: `Copy-Item .env.example .env`.
2. Instale as dependências: `npm install`.
3. Inicie interface e API: `npm run dev`.
4. Abra `http://localhost:5173`.

Para gerar a versão de produção, execute `npm run build` e depois `npm start`. A aplicação estará em `http://localhost:3001` (ou na porta definida em `PORT`). O banco é criado automaticamente em `data/comercial.sqlite`, ou no caminho de `DATABASE_PATH`. Preserve e faça cópias desse arquivo para manter os dados.

### Acessos de demonstração

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@orbe.local` | `Orbe2026!` |
| Gerente | `gerente@orbe.local` | `Gerente2026!` |
| Vendedor | `vendas@orbe.local` | `Vendedora2026!` |

**Atenção:** esses são acessos públicos de demonstração, criados apenas quando o banco está vazio. Troque as senhas, desative o modo de demonstração e cadastre usuários reais antes de qualquer uso em produção.

## Aplicativo para Windows (.exe)

Para gerar o instalador e a versão portátil do aplicativo:

1. Instale as dependências com `npm install`.
2. Execute `npm run desktop:build`.
3. Os arquivos `.exe` serão criados na pasta `release`: instalador e versão portátil.

O aplicativo desktop funciona sem internet para os recursos locais e guarda o banco em `%APPDATA%\Orbe Comercial\comercial.sqlite`, separado do banco usado pela versão web. A cópia de segurança do banco pode ser baixada pela tela de Configurações. Para enviar e-mails de recuperação, crie o arquivo `.env` nessa mesma pasta de dados e configure SMTP. Não há gateway de pagamento incluído. Os executáveis são gerados sem assinatura digital, então o Windows pode exibir um aviso do SmartScreen.

## Funcionalidades

- Sessões seguras, saída, recuperação de senha, papéis de administrador, gerente e vendedor.
- Painel com vendas, pedidos em aberto, ticket médio, metas, alertas de estoque e tarefas.
- Cadastro, pesquisa e paginação de clientes, com histórico de pedidos.
- Produtos, custos, preços, categorias, estoque mínimo e histórico de entradas, saídas e ajustes.
- Oportunidades com etapas configuráveis, contatos e próximos acompanhamentos.
- Orçamentos com vários produtos, desconto por item e geral, aprovação de desconto e impressão.
- Conversão de orçamento em pedido com conferência de estoque, parcelas e acompanhamento de pagamento e entrega.
- Venda avulsa à vista sem cadastro de cliente, com pagamento recebido e baixa automática do estoque.
- Metas mensais e comissão configurável por vendedor.
- Relatórios por período, vendedor, produto e cliente, com exportação CSV e opção de imprimir ou salvar em PDF pelo navegador.
- Registro de atividades administrativas importantes e alterações em pedidos.
- **Contas a receber**: parcelas pendentes, vencidas e a vencer, com atalho de cobrança por WhatsApp e alerta no painel.
- **Margem e lucro bruto** nos relatórios (o custo de cada item é gravado no momento da venda) e valor do estoque a custo.
- Orçamentos podem ser **recusados** ou ter a **validade prorrogada**; orçamentos vencidos não são convertidos.
- Produtos podem ser **inativados e reativados** sem perder o histórico.
- Alteração da própria senha, backup do banco pela interface (administrador) e modo de demonstração configurável.

## Regras e decisões adotadas

- O limite padrão de desconto sem aprovação é 10%. Acima dele, o orçamento aguarda aprovação de gerente ou administrador.
- Vendas sem estoque são bloqueadas. Um administrador pode ativar a opção de backorder nas configurações; a saída efetivamente atendida continua registrada no estoque.
- Venda avulsa representa atendimento de balcão: o pagamento é recebido na hora e a entrega é marcada como concluída. Ela usa um registro interno agrupador, oculto da lista de clientes, sem criar ficha de cliente.
- Parcelas são mensais, começam na data da conversão e a última absorve diferenças de centavos. O prazo é uma decisão padrão editável pelo registro manual do pagamento.
- O progresso da meta e a comissão estimada consideram pedidos integralmente pagos e excluem cancelamentos. Comissão é uma estimativa operacional, não cálculo fiscal ou folha de pagamento.
- A recuperação local mostra um token de desenvolvimento na tela. Para enviar links em produção, preencha `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` e `APP_URL`; sem SMTP o sistema não envia mensagens.
- A impressão usa o diálogo do navegador, onde se pode selecionar “Salvar como PDF”.
- Imagens de produto são cadastradas por URL HTTPS. Upload e armazenamento de arquivos exigiriam configurar um serviço de arquivos.
- O sistema registra pagamentos manualmente. Não há gateway configurado nem dados de cartão armazenados. Para cobrança automática, configure um provedor compatível e suas credenciais em uma integração própria.
- O sistema inicia com `BRL`, etapas padrão do funil, limite de desconto de 10% e comissão padrão de 5%. Essas definições refletem uma operação comercial simples, sem requisitos de negócio adicionais fornecidos.

## Novidades desta versão

- **Segurança**: bloqueio de login após 5 tentativas erradas em 15 minutos (por IP + e-mail), limpeza de sessões expiradas, cabeçalhos CSP/HSTS em produção, sessões revogadas ao trocar a senha ou desativar usuário, proteção contra remover o último administrador e tela de login sem credenciais preenchidas (os botões de demonstração só aparecem no modo de demonstração).
- **Correções**: metas, relatórios e vencimentos agora usam o fuso de Brasília (antes o mês virava às 21h); parcelas não "pulam" de mês (31/01 + 1 mês = 28/02); valores monetários são arredondados em centavos e a soma dos itens sempre fecha com o total; o cancelamento de pedido é atômico (estoque, parcelas e histórico juntos), cancela parcelas pendentes e avisa quando há valor já recebido para estornar; a meta do painel passou a comparar com vendas **pagas no mês**.
- **Cadastro**: CPF/CNPJ validados pelos dígitos verificadores, com bloqueio de duplicidade. Documentos já existentes só são revalidados se forem alterados.
- **Banco**: migração 3 adiciona `unit_cost` aos itens de pedido (pedidos antigos recebem o custo atual do produto como aproximação) e índices de desempenho.
- Alterações de variáveis: `TRUST_PROXY=true` deve ser definido se o sistema estiver atrás de proxy reverso (para o limite de login enxergar o IP real).

## Segurança e dados

Senhas usam `scrypt`; as sessões usam cookies `HttpOnly` e `SameSite=Lax`, com `Secure` em produção. Os tokens de sessão e recuperação são armazenados em hash. Validação de papéis e operações acontece na API, além dos controles da interface. Valores de cobrança e estoque são recalculados no servidor. O arquivo `.env` e o banco local ficam fora do controle de versão.

O esquema é aplicado na inicialização em `server/db.js`. A tabela `schema_migrations` registra a versão instalada; alterações compatíveis do banco são aplicadas automaticamente.

## Verificação

```sh
npm test
npm run build
```

Os testes de API cobrem cadastro e validação de cliente (incluindo CPF/CNPJ), criação e cálculo de orçamento, exigência de aprovação, recusa e validade, conversão, parcelas, pagamentos, contas a receber, margem nos relatórios, cancelamento com estorno de estoque, bloqueio de estoque, limite de tentativas de login, troca de senha, backup e permissões por perfil.
