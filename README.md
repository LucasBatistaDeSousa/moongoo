# Sistema de Cadastro de Clientes com MongoDB Sharding

Aplicação full-stack para gerenciamento de clientes com arquitetura de MongoDB Sharding distribuída em 3 shards.

## Equipe

- **Lucas Batista de Sousa**
- **Heloisa Pichelli Souza**
- **Carolina Pichelli Souza**

## Arquitetura

```
Frontend (React)
    ↓
Backend (NestJS)
    ↓
MongoDB Sharding Cluster
    ├── Shard 1 (rs0)
    ├── Shard 2 (rs1)
    ├── Shard 3 (rs2)
    ├── Config Server
    └── Mongos Router
```

## Estrutura do Projeto

```
moongoo/
├── frontend/                 # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── App.jsx          # Componente principal
│   │   └── App.css          # Estilos globais
│   ├── Dockerfile           # Build multi-stage
│   └── package.json
│
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── customers/       # Módulo de clientes
│   │   ├── main.ts          # Ponto de entrada
│   │   └── app.module.ts
│   ├── Dockerfile           # Build multi-stage
│   ├── seed.js              # Dados iniciais
│   └── package.json
│
├── scripts/                  # Scripts de inicialização
│   ├── init-replica-sets.js # Configuração de replica sets
│   └── init-sharding.mongosh # Inicialização de sharding
│
└── docker-compose.yml       # Orquestração dos containers
```

## Pré-requisitos

- Docker e Docker Compose
- Git

## Como Rodar

### 1. Clone o repositório

```bash
git clone https://github.com/LucasBatistaDeSousa/moongoo.git
cd moongoo
```

### 2. Inicie os containers

```bash
docker compose up
```

Aguarde até que todos os serviços estejam prontos (aproximadamente 2-3 minutos):

- **Shards**: Inicializam e ficam healthy
- **Mongos**: Router conecta aos shards
- **Init-Sharding**: Configura o sharding
- **Backend**: Inicia e popula dados (seed)
- **Frontend**: Fica disponível no navegador

### 3. Acesse a aplicação

```
Frontend: http://localhost:3001
Backend:  http://localhost:3000
```

## Endpoints da API

### Clientes

- `GET /customers` - Lista todos os clientes
- `POST /customers` - Cria um novo cliente
- `GET /customers/:id` - Obtém detalhes de um cliente
- `PUT /customers/:id` - Atualiza um cliente
- `DELETE /customers/:id` - Deleta um cliente
- `GET /customers/debug/sharding` - Info de chunks e shards

## MongoDB Sharding

### Configuração

- **Shard Key**: CPF (numérico)
- **3 Shards**: rs0, rs1, rs2
- **Distribuição**: Automática via chunks MongoDB

### Como Funciona

1. **Replica Sets**: Cada shard é um replica set (1 nó em dev)
2. **Config Server**: Armazena metadados de sharding
3. **Mongos Router**: Roteia operações para o shard correto
4. **Chunks**: MongoDB divide dados por ranges de CPF

### Observações

- Com dados pequenos (< 500 registros), tudo fica em 1 shard
- MongoDB distribui automaticamente quando há múltiplos chunks
- Ideal para aplicações com milhões de registros

## Dados Iniciais

O script `seed.js` popula automaticamente 10 clientes ao iniciar o backend.

```bash
# Para adicionar mais dados via API
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "123.456.789-10",
    "email": "joao@example.com",
    "telefone": "(11)98888-8888",
    "dataNascimento": "1990-01-15",
    "endereco": "Rua A, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-100"
  }'
```

## Stack Tecnológico

### Frontend
- React 18
- Axios (HTTP client)
- CSS3 (Grid, Flexbox)

### Backend
- NestJS (Framework Node.js)
- MongoDB/Mongoose
- TypeScript

### Banco de Dados
- MongoDB 7.0
- Sharding distribuído
- Replica Sets

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Network bridge

## Desenvolvimento

### Estrutura de Branches

- `main` - Produção
- `claude/*` - Feature branches

### Parar os containers

```bash
docker compose down
```

### Limpar dados e reiniciar

```bash
docker compose down -v
docker compose up
```

### Ver logs

```bash
docker compose logs -f [serviço]
```

Serviços disponíveis: `backend`, `frontend`, `mongos`, `shard1`, `shard2`, `shard3`, `config`, `init-sharding`

## Performance

- Seed: ~2-3s (10 clientes)
- Startup total: ~60-90s
- Latência API: ~10-50ms
- Capacidade: Escalável para milhões de registros

## Troubleshooting

### Backend não inicia
```bash
docker compose logs backend
```

### Frontend não conecta ao backend
- Verificar se backend está rodando: `docker compose ps`
- Verificar logs: `docker compose logs backend`

### MongoDB não inicia
- Verificar espaço em disco
- Deletar volumes: `docker compose down -v`

### Porta já em uso
```bash
# Mudar portas em docker-compose.yml
# Ou liberar a porta:
# Windows: netstat -ano | findstr :3000
# Linux: lsof -i :3000
```

## Licença

Projeto educacional

## Contato

**Equipe**: Lucas Batista de Sousa, Heloisa Pichelli Souza, Carolina Pichelli Souza
