# WatchBrasil Tasks

Aplicação fullstack de gerenciamento de tarefas com colaboração em tempo real.

## Tech Stack

- **Frontend:** Vue.js 3 + Tailwind CSS
- **Backend:** Node.js + Express 5
- **Banco de Dados:** PostgreSQL 16 (Prisma ORM)
- **Autenticação:** JWT
- **Streaming:** Server-Sent Events (SSE)
- **Testes:** Jest
- **Documentação:** Swagger/OpenAPI
- **Infra:** Docker + AWS Lambda (Serverless)

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### Com Docker (recomendado)

```bash
docker compose up --build
```

O backend estará em `http://localhost:3000` e o banco PostgreSQL na porta `5432`.

### Sem Docker

```bash
# 1. Banco de dados
docker compose up db -d

# 2. Backend
cd backend
cp .env.example .env  # configure as variáveis
npm install
npx prisma migrate deploy
npm run dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

## Documentação da API

Acesse a documentação Swagger em: `http://localhost:3000/api-docs`

### Endpoints principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/register | Criar conta |
| POST | /api/auth/login | Fazer login |
| GET | /api/tasks | Listar tarefas (com filtros) |
| POST | /api/tasks | Criar tarefa |
| GET | /api/tasks/:id | Detalhe da tarefa |
| PUT | /api/tasks/:id | Atualizar tarefa |
| DELETE | /api/tasks/:id | Deletar tarefa |
| GET | /api/categories | Listar categorias |
| POST | /api/categories | Criar categoria |
| PUT | /api/categories/:id | Atualizar categoria |
| DELETE | /api/categories/:id | Deletar categoria |
| POST | /api/tasks/:taskId/assignments | Atribuir colaborador |
| DELETE | /api/tasks/:taskId/assignments/:id | Remover colaborador |
| POST | /api/tasks/:taskId/comments | Adicionar comentário |
| GET | /api/tasks/:taskId/comments | Listar comentários |
| DELETE | /api/tasks/:taskId/comments/:id | Deletar comentário |
| GET | /api/reports | Relatório de tarefas |
| GET | /api/stream | Conexão SSE (tempo real) |

### Exemplos de uso

```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Ronald", "email": "ronald@test.com", "password": "123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ronald@test.com", "password": "123456"}'

# Criar tarefa (use o token retornado no login)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title": "Minha tarefa", "priority": "HIGH"}'

# Listar tarefas com filtro
curl http://localhost:3000/api/tasks?status=PENDING \
  -H "Authorization: Bearer SEU_TOKEN"

# Criar categoria
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name": "Trabalho", "color": "#FF5733"}'

# Atribuir colaborador
curl -X POST http://localhost:3000/api/tasks/TASK_ID/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"email": "colaborador@test.com", "role": "COLLABORATOR"}'

# Adicionar comentário
curl -X POST http://localhost:3000/api/tasks/TASK_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"content": "Preciso de ajuda nesta tarefa"}'

# Relatório
curl http://localhost:3000/api/reports \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Testes

```bash
cd backend
npm test
```

Resultado esperado: 11 testes passando (auth service + task service).

## Arquitetura

```
watchbrasil-challenge/
├── backend/
│   ├── src/
│   │   ├── config/          # Prisma client e Swagger
│   │   ├── controllers/     # Camada HTTP (req/res)
│   │   ├── services/        # Lógica de negócio
│   │   ├── middlewares/      # Auth JWT
│   │   ├── routes/           # Definição de rotas
│   │   ├── streaming/        # SSE (Server-Sent Events)
│   │   ├── docs/             # Documentação OpenAPI
│   │   ├── __tests__/        # Testes unitários
│   │   ├── app.js            # Express app
│   │   ├── server.js         # Entry point
│   │   └── lambda.js         # Handler AWS Lambda
│   ├── prisma/               # Schema e migrations
│   ├── Dockerfile
│   └── serverless.yml        # Config AWS Lambda
├── frontend/
│   └── src/
│       ├── views/            # Páginas (Login, Dashboard, Tasks)
│       ├── stores/           # Pinia (estado global)
│       ├── services/         # API client (Axios)
│       └── router/           # Vue Router
└── compose.yml               # Docker Compose
```

## Decisões Técnicas

- **Service Layer Architecture:** separação clara entre controllers (HTTP), services (lógica) e banco (Prisma). Facilita testes e manutenção.
- **Validação de ownership:** toda operação verifica se o recurso pertence ao usuário autenticado, impedindo acesso a dados de outros usuários.
- **Validação de categoria:** ao criar/atualizar uma tarefa com categoria, o sistema valida se a categoria pertence ao usuário, evitando associações indevidas.
- **SSE para streaming:** notificações em tempo real quando um colaborador é atribuído ou comenta em uma tarefa. O frontend pode se conectar via `GET /api/stream` para receber eventos.
- **Testes nos services:** testamos a camada de lógica de negócio com mocks do Prisma, sem dependência de banco real. Padrão Arrange-Act-Assert.
- **JWT com expiração de 7 dias:** token armazenado no localStorage do frontend, enviado automaticamente via interceptor do Axios.
- **Filtros no backend:** as tarefas podem ser filtradas por status, prioridade e categoria via query params.

## Limitações Conhecidas

- **SSE em Lambda:** Server-Sent Events funcionam no ambiente Docker/local. Em ambiente serverless (Lambda), os endpoints REST operam normalmente. Para SSE em produção serverless, a recomendação seria utilizar AWS API Gateway com WebSocket ou um serviço dedicado fora do Lambda.
- **Connection pooling:** em ambiente Lambda, cada invocação pode abrir novas conexões ao PostgreSQL. Para produção, recomenda-se usar PgBouncer ou Prisma Accelerate.

## Deploy

### AWS Lambda

```bash
cd backend
npx serverless deploy
```

Requer AWS CLI configurado com credenciais válidas e as variáveis de ambiente `DATABASE_URL` e `JWT_SECRET` configuradas no provider.

### Docker (produção)

```bash
docker compose up --build -d
```
