# 🎯 Sistema de Cadastro de Clientes com MongoDB Sharding

Aplicação completa de gerenciamento de clientes com arquitetura moderna baseada em **React + NestJS + MongoDB Sharded**.

## 📋 Funcionalidades

✅ **Cadastrar cliente** - Adicionar novo cliente ao sistema  
✅ **Consultar todos os clientes** - Listar todos os cadastros  
✅ **Consultar cliente por ID** - Visualizar detalhes específicos  
✅ **Atualizar dados** - Editar informações do cliente  
✅ **Deletar cliente** - Remover cliente do sistema  

## 🏗️ Arquitetura

```
┌─────────────────┐
│   React (UI)    │
│   :3000         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  NestJS API     │
│   :3000         │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│    MongoDB Sharding (3 Shards)           │
├──────────────────────────────────────────┤
│ Shard 1    │ Shard 2    │ Shard 3        │
│ :27017     │ :27018     │ :27019         │
├──────────────────────────────────────────┤
│ Config Server (:27020)                   │
│ Mongos Router (:27021)                   │
└──────────────────────────────────────────┘
```

## 🚀 Quick Start

### Pré-requisitos
- Docker e Docker Compose
- Node.js 16+
- npm ou yarn

### 1️⃣ Clonar e Estrutura

```bash
cd mongoolose
```

### 2️⃣ Iniciar MongoDB Sharded

```bash
# Subir os containers
docker-compose up -d

# Aguarde ~15 segundos para os containers iniciarem
sleep 15

# Inicializar sharding
chmod +x scripts/init-sharding.sh
bash scripts/init-sharding.sh
```

### 3️⃣ Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### 4️⃣ Configurar Variáveis de Ambiente

**Backend** (backend/.env):
```env
PORT=3000
MONGO_URI=mongodb://localhost:27021/customers
```

**Frontend** (frontend/.env.local):
```env
REACT_APP_API_URL=http://localhost:3000
```

### 5️⃣ Iniciar a Aplicação

**Backend** (terminal 1):
```bash
cd backend
npm run start:dev
# ✓ API rodando em http://localhost:3000
```

**Frontend** (terminal 2):
```bash
cd frontend
npm start
# ✓ Abrirá em http://localhost:3000
# (ajuste porta se necessário)
```

## 📊 Dados do Cliente

| Campo | Tipo | Obrigatório | Exemplo |
|-------|------|-------------|---------|
| Nome | String | ✅ | João da Silva |
| CPF | String | ✅ | 123.456.789-00 |
| E-mail | String | ✅ | joao@example.com |
| Telefone | String | ✅ | (11) 99999-9999 |
| Data de Nascimento | Date | ✅ | 1990-01-15 |
| Endereço | String | ✅ | Rua A, 123 |
| Cidade | String | ✅ | São Paulo |
| Estado | String | ✅ | SP |
| CEP | String | ✅ | 01310-100 |

## 🔄 Fluxo de Operações

### Cadastrar Cliente
```
1. Preencher formulário no lado esquerdo
2. Clicar "Cadastrar"
3. API salva no MongoDB (distribuído nos shards)
4. Lista atualiza automaticamente
```

### Consultar Clientes
```
1. Todos os clientes aparecem na lista do meio
2. Clicar em um cliente para ver detalhes
3. Informações completas aparecem à direita
```

### Atualizar Cliente
```
1. Clicar no cliente na lista
2. Clicar botão "✏️ Editar" nos detalhes
3. Formulário é preenchido automaticamente
4. Fazer alterações e clicar "Atualizar"
```

### Deletar Cliente
```
1. Clicar no cliente na lista
2. Clicar botão "🗑️ Deletar" nos detalhes
3. Confirmar exclusão
4. Cliente removido do sistema
```

## 🗄️ MongoDB Sharding

### Como Funciona

O sistema está configurado com **3 shards independentes**:

- **Shard 1** (porta 27017): Primeira partição de dados
- **Shard 2** (porta 27018): Segunda partição de dados
- **Shard 3** (porta 27019): Terceira partição de dados

Cada shard é uma instância MongoDB completa com seus próprios dados.

### Chave de Sharding

A distribuição é feita pela chave **CPF**, garantindo que:
- Documentos com o mesmo CPF ficam no mesmo shard
- Dados são distribuídos equilibradamente entre shards
- Escalabilidade horizontal automática

### Verifying Sharding Status

```bash
# Conectar ao mongos e verificar status
docker exec mongos mongosh

use admin
sh.status()
```

## 📡 Endpoints da API

### Cadastrar Cliente
```http
POST /customers
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@example.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1990-01-15",
  "endereco": "Rua A, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310-100"
}
```

### Listar Todos
```http
GET /customers
```

### Obter por ID
```http
GET /customers/:id
```

### Atualizar
```http
PUT /customers/:id
Content-Type: application/json

{
  "nome": "Novo Nome",
  "email": "novo@example.com"
}
```

### Deletar
```http
DELETE /customers/:id
```

## 🛠️ Troubleshooting

### MongoDB não conecta

```bash
# Verificar status dos containers
docker ps

# Ver logs
docker logs mongos
docker logs config
docker logs shard1
```

### Porta já em uso

```bash
# Matarprocessos
lsof -i :3000  # Backend
lsof -i :3001  # Frontend

kill -9 <PID>
```

### Resetar tudo

```bash
# Parar e remover containers
docker-compose down
docker volume prune

# Recomeçar do zero
docker-compose up -d
bash scripts/init-sharding.sh
```

## 📚 Estrutura do Projeto

```
mongoolose/
├── backend/
│   ├── src/
│   │   ├── main.ts              # Entry point
│   │   ├── app.module.ts        # Módulo principal
│   │   └── customers/
│   │       ├── customers.controller.ts
│   │       ├── customers.service.ts
│   │       ├── customers.module.ts
│   │       ├── schemas/
│   │       │   └── customer.schema.ts
│   │       └── dto/
│   │           └── create-customer.dto.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Componente principal
│   │   ├── App.css
│   │   └── components/
│   │       ├── CustomerForm.jsx
│   │       ├── CustomerList.jsx
│   │       └── CustomerDetail.jsx
│   ├── package.json
│   └── public/
├── docker-compose.yml           # Configuração dos containers
├── scripts/
│   └── init-sharding.sh        # Script de inicialização
├── .env.example
└── README.md
```

## 🎓 O que Você Aprendeu

✅ Configuração de MongoDB Sharding com Docker  
✅ NestJS com Mongoose para CRUD completo  
✅ React com gerenciamento de estado  
✅ Integração Frontend-Backend  
✅ Distribuição de dados em múltiplos shards  
✅ Boas práticas de validação de dados  

## 📝 Próximos Passos

- [ ] Adicionar autenticação JWT
- [ ] Implementar paginação na lista
- [ ] Adicionar busca e filtros
- [ ] Testes automatizados (Jest, Cypress)
- [ ] Deploy em produção (Kubernetes, Docker Swarm)
- [ ] Monitoramento com Prometheus/Grafana
- [ ] Replicação entre shards para alta disponibilidade

## ⚠️ Notas Importantes

1. **Sharding em produção** usa múltiplas máquinas físicas
2. Este projeto usa Docker na mesma máquina para fins educacionais
3. A chave de sharding (CPF) não pode ser modificada após criação
4. Backups regulares são essenciais em produção

---

**Desenvolvido como exercício prático de arquitetura escalável com MongoDB** 🚀
