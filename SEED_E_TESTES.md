# 🌱 Seed de Dados e Verificação de Sharding

## Como Testar o Sharding em Ação

### Passo 1: Confirme que tudo está rodando

```powershell
# 1. MongoDB Sharding
docker ps  # Deve mostrar 5 containers (3 shards + config + mongos)

# 2. Backend
# Terminal separado:
cd backend
npm run start:dev
# Deve mostrar: ✓ API rodando em http://localhost:3000

# 3. Frontend
# Outro terminal:
cd frontend
npm start
# Deve abrir http://localhost:3000
```

---

### Passo 2: Popular o Banco com Seed

No terminal do backend, **enquanto a API está rodando**, abra um novo PowerShell:

```powershell
cd C:\Users\Lucas\Desktop\mongoolose\backend

# Rodar o seed (10 clientes distribuídos entre 3 shards)
npm run seed
```

**Resultado esperado:**
```
🌱 Iniciando seed de clientes...

✅ João Silva           | CPF: 111.111.111-11 | ID: 66b1a2c3d4e5f6g7h8i9j0k1
✅ Maria Santos         | CPF: 222.222.222-22 | ID: 66b1a2c3d4e5f6g7h8i9j0k2
✅ Carlos Mendes        | CPF: 333.333.333-33 | ID: 66b1a2c3d4e5f6g7h8i9j0k3
...

📊 Resumo: 10 criados, 0 falhados
```

---

### Passo 3: Verificar a Distribuição entre Shards

**Opção A: Via Script (Windows PowerShell)**

```powershell
# Ver status do cluster e distribuição
docker exec mongos mongosh --eval "
use admin
print('📊 STATUS DO CLUSTER:')
sh.status()
"
```

**Opção B: Via Script Bash (WSL ou Git Bash)**

```bash
# Usar o script de verificação
bash scripts/verify-sharding.sh
```

**Opção C: Conectar Interativamente**

```powershell
docker exec -it mongos mongosh
```

Dentro do mongosh:

```javascript
use admin
sh.status()

// Ver detalhes dos chunks
use customers
db.chunks.find().pretty()

// Listar todos os clientes
db.customers.find({}, {nome: 1, cpf: 1}).pretty()

// Contar por shard
db.customers.aggregate([
  { $group: { _id: null, total: { $sum: 1 } } }
])
```

---

## 📊 O Que Você Verá

### Status do Sharding

```
shards:
  [
    { _id: 'rs0', host: 'rs0/shard1:27017', state: 1 },
    { _id: 'rs1', host: 'rs1/shard2:27017', state: 1 },
    { _id: 'rs2', host: 'rs2/shard3:27017', state: 1 }
  ]

databases:
  [
    {
      _id: 'customers',
      primary: 'rs0',
      partitioned: true
    }
  ]
```

### Distribuição de Dados

Os 10 clientes serão distribuídos automaticamente entre os 3 shards baseado no CPF:

```
Shard: rs0 | Range: MIN até 444.444.444-44 | Documentos: 4
Shard: rs1 | Range: 444.444.444-44 até 777.777.777-77 | Documentos: 3
Shard: rs2 | Range: 777.777.777-77 até MAX | Documentos: 3
```

---

## 🧪 Teste Completo CRUD + Sharding

### 1. Criar Cliente (Já feito pelo seed)
```
POST /customers → 10 clientes criados
✓ Distribuídos entre 3 shards
```

### 2. Listar Todos
```
GET /customers → Lista os 10 clientes
✓ Busca em todos os 3 shards transparentemente
```

### 3. Obter por ID
```
GET /customers/{id} → Detalhes completo
✓ Mongos encontra em qual shard está
```

### 4. Atualizar
```
PUT /customers/{id} → Muda email/telefone
✓ CPF não pode ser alterado (é a chave de sharding)
```

### 5. Deletar
```
DELETE /customers/{id} → Remove cliente
✓ Removido do shard correspondente
```

---

## 🎓 Como Explicar pro Professor

"O sistema usa MongoDB Sharding com 3 shards independentes. Cada cliente é armazenado baseado no seu CPF:
- **CPF 111-333**: Shard 1
- **CPF 444-777**: Shard 2  
- **CPF 777-999**: Shard 3

O Mongos Router distribui e recupera dados transparentemente. Quando você cria um cliente, ele é salvo no shard correto. Quando lista, o Mongos busca em todos os 3 ao mesmo tempo."

---

## 📝 Arquivos Criados

- `backend/seed.js` - Script que popula 10 clientes
- `scripts/verify-sharding.sh` - Script para verificar distribuição
- `backend/package.json` - Adicionado script `npm run seed`

**Como rodar:**
```powershell
npm run seed          # Cria 10 clientes
docker exec mongos mongosh --eval "use admin; sh.status()"  # Vê distribuição
```
