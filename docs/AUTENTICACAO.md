# Autenticação do Orbe Gestão Comercial

## Visão geral

A aplicação utiliza autenticação por sessão mantida no servidor, com React no frontend, Express no backend e SQLite para persistência. Não utiliza JWT.

## Fluxo de login

1. O frontend envia as credenciais para `POST /api/auth/login`.
2. O backend localiza o usuário, verifica se está ativo e valida a senha.
3. A senha é armazenada como `salt:digest`. O digest é calculado com scrypt e salt aleatório.
4. Após autenticação válida, o servidor gera um token aleatório criptograficamente seguro.
5. O banco armazena somente o SHA-256 do token, associado ao usuário e à expiração.
6. O token original é enviado ao navegador em cookie `orbe_session`, com `HttpOnly`, `SameSite=Lax`, `Path=/` e validade de sete dias. Em produção, também usa `Secure`.
7. O frontend consulta `/api/session` para recuperar o usuário autenticado.

## Proteção das rotas

O middleware de autenticação lê o cookie, calcula seu SHA-256, procura a sessão no banco e verifica expiração e situação do usuário. As rotas protegidas recebem o usuário autenticado em `req.user`.

As permissões são organizadas por papéis (`admin`, `manager` e `seller`). Uma requisição sem sessão válida recebe HTTP 401; uma sessão autenticada sem permissão recebe HTTP 403.

## Encerramento e recuperação

- Logout remove a sessão persistida e limpa o cookie.
- Recuperação de senha usa token aleatório, armazenado como hash, com validade de 30 minutos e uso único.
- A redefinição de senha invalida as sessões existentes.
- A alteração de senha invalida as outras sessões, preservando a sessão atual.

## Controles identificados

- Hash de senha com scrypt e salt aleatório.
- Comparação de hashes com `crypto.timingSafeEqual`.
- Tokens de sessão aleatórios e armazenados como hash.
- Cookie HttpOnly e SameSite=Lax; Secure em produção.
- Expiração de sessão e controle de papéis.
- Registro de auditoria.
- Limitação de tentativas de login em memória: bloqueio após cinco falhas por combinação de IP e e-mail durante 15 minutos.

## Recomendações antes de produção

1. Adicionar proteção CSRF ou validação explícita de origem nas operações sensíveis.
2. Substituir o rate limit em memória por armazenamento compartilhado e persistente.
3. Desabilitar usuários e credenciais demonstrativas antes da publicação.
4. Configurar HTTPS, SMTP e variáveis de ambiente em ambiente de produção.
5. Manter `developmentToken` restrito ao desenvolvimento e evitar registrar tokens de recuperação em logs.
6. Avaliar rotação de sessão e expiração por inatividade.

## Configuração

Use `.env.example` como referência para criar seu próprio `.env`. Nunca publique o arquivo `.env`, credenciais SMTP, bancos de dados locais ou segredos reais.

## Observação

Este documento descreve a implementação revisada no pacote do projeto. Para instalar e executar a aplicação, o código-fonte completo também precisa estar presente no repositório.
