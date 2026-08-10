# ⚡ QUICKSTART - Execute Tudo com Docker Compose

## 🚀 Passo 1: Clone o Repositório

```bash
git clone https://github.com/LucasBatistaDeSousa/moongoo.git
cd moongoo
```

## 🚀 Passo 2: Execute o Docker Compose

```bash
docker compose up
```

**Pronto!** Tudo vai rodar automaticamente:

- ✅ **3 Shards MongoDB** (27017, 27018, 27019)
- ✅ **Config Server** (27020)
- ✅ **Mongos Router** (27021)
- ✅ **Backend NestJS** (3000)
- ✅ **Frontend React** (3001)
- ✅ **Seed (10 clientes)** - Automático
- ✅ **Sharding Inicializado** - Automático

---

## 🌐 Acesse a Aplicação

### Interface Web
```
http://localhost:3001
```

Ou use o localhost:3000 se preferir.

---

## 📊 Ver Distribuição nos Shards

```bash
# Em um novo terminal:
docker exec mongos mongosh --eval "use admin; sh.status()"
```

Você verá algo como:

```
shards:
[
  { _id: 'rs0', host: 'rs0/shard1:27017', state: 1 },
  { _id: 'rs1', host: 'rs1/shard2:27017', state: 1 },
  { _id: 'rs2', host: 'rs2/shard3:27017', state: 1 }
]
```

---

## 🧪 Testar CRUD

### 1. **Criar Cliente** (via interface ou API)
```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste",
    "cpf": "123.456.789-00",
    "email": "teste@example.com",
    "telefone": "(11)98888-8888",
    "dataNascimento": "1990-01-15",
    "endereco": "Rua Test",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01310-100"
  }'
```

### 2. **Listar Clientes**
```bash
curl http://localhost:3000/customers
```

### 3. **Obter Cliente por ID**
```bash
curl http://localhost:3000/customers/<ID>
```

### 4. **Atualizar Cliente**
```bash
curl -X PUT http://localhost:3000/customers/<ID> \
  -H "Content-Type: application/json" \
  -d '{"email": "novo@example.com"}'
```

### 5. **Deletar Cliente**
```bash
curl -X DELETE http://localhost:3000/customers/<ID>
```

---

## 📈 Dados de Teste (Seed Automático)

10 clientes são criados automaticamente, distribuídos entre os 3 shards:

| CPF | Nome | Shard |
|-----|------|-------|
| 111.111.111-11 | João Silva | rs0 |
| 222.222.222-22 | Maria Santos | rs0 |
| 333.333.333-33 | Carlos Mendes | rs0 |
| 444.444.444-44 | Ana Costa | rs0/rs1 |
| 555.555.555-55 | Pedro Oliveira | rs1 |
| 666.666.666-66 | Lucas Ferreira | rs1 |
| 777.777.777-77 | Fernanda Alves | rs1/rs2 |
| 888.888.888-88 | Ricardo Gomes | rs2 |
| 999.999.999-99 | Juliana Martins | rs2 |
| 101.010.101-01 | Bruno Castro | rs2 |

---

## 🛑 Parar Tudo

```bash
docker compose down
```

---

## 📊 Ver Logs

```bash
# Todos os serviços
docker compose logs -f

# Backend apenas
docker compose logs -f backend

# Frontend apenas
docker compose logs -f frontend

# MongoDB apenas
docker compose logs -f mongos
```

---

## 🎓 Como Funciona

1. **Docker Compose inicia 5 containers MongoDB**
   - 3 Shards (rs0, rs1, rs2)
   - 1 Config Server (configrs)
   - 1 Mongos Router

2. **Serviço `init-sharding` inicializa o sharding**
   - Aguarda MongoDB ficar pronto
   - Inicializa replica sets
   - Adiciona shards ao mongos
   - Habilita sharding na collection `customers.customers`
   - Usa CPF como chave de sharding

3. **Backend NestJS inicia**
   - Conecta ao mongos em `mongodb://mongos:27017/customers`
   - Expõe API em `:3000`
   - Roda seed automaticamente após 15 segundos

4. **Frontend React inicia**
   - Build estático com nginx
   - Serve em `:3001`
   - Conecta à API em `http://localhost:3000`

---

## ✅ Demonstração Pronta

Agora você tem um **sistema completo de sharding** funcionando:

- ✅ Interface Web com CRUD
- ✅ API REST com validações
- ✅ MongoDB Sharding com 3 instâncias
- ✅ Distribuição automática de dados (chave: CPF)
- ✅ Dados de teste pré-carregados

**Perfeito para apresentação!** 🎉
