# 🚀 SETUP COMPLETO - MongoDB Sharding com React + NestJS

## ⚡ Quickstart (Copie e Cole)

### **Passo 1: Subir MongoDB Sharding**

```bash
cd C:\Users\Lucas\Desktop\mongoolose
docker compose up -d
Start-Sleep -Seconds 15
```

### **Passo 2: Inicializar Sharding**

```bash
# Abra o mongosh e execute CADA BLOCO um por um:
docker exec -it shard1 mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'shard1:27017'}]})"
Start-Sleep -Seconds 5

docker exec -it shard2 mongosh --eval "rs.initiate({_id: 'rs1', members: [{_id: 0, host: 'shard2:27017'}]})"
Start-Sleep -Seconds 5

docker exec -it shard3 mongosh --eval "rs.initiate({_id: 'rs2', members: [{_id: 0, host: 'shard3:27017'}]})"
Start-Sleep -Seconds 5

docker exec -it config mongosh --eval "rs.initiate({_id: 'configrs', members: [{_id: 0, host: 'config:27017'}]})"
Start-Sleep -Seconds 15

docker exec -it mongos mongosh --eval "sh.addShard('rs0/shard1:27017'); sh.addShard('rs1/shard2:27017'); sh.addShard('rs2/shard3:27017');"

docker exec -it mongos mongosh --eval "use customers; sh.enableSharding('customers'); sh.shardCollection('customers.customers', { cpf: 1 });"
```

### **Passo 3: Backend (Terminal 1)**

```powershell
cd C:\Users\Lucas\Desktop\mongoolose\backend
npm install
npm run start:dev
```

Espera aparecer: `✓ API rodando em http://localhost:3000`

### **Passo 4: Frontend (Terminal 2)**

```powershell
cd C:\Users\Lucas\Desktop\mongoolose\frontend
npm install
npm start
```

Vai abrir em `http://localhost:3000`

### **Passo 5: Popular Banco com Seed (Terminal 3)**

```powershell
cd C:\Users\Lucas\Desktop\mongoolose\backend
npm run seed
```

Resultado:
```
🌱 Iniciando seed de clientes...
✅ João Silva | CPF: 111.111.111-11 | ID: ...
✅ Maria Santos | CPF: 222.222.222-22 | ID: ...
... (10 clientes criados)
📊 Resumo: 10 criados, 0 falhados
```

### **Passo 6: Ver Distribuição nos Shards** ⭐

```powershell
docker exec mongos mongosh --eval "
use admin
print('📊 STATUS DO CLUSTER:')
sh.status()
"
```

**Você verá:**
```
shards:
[
  { _id: 'rs0', host: 'rs0/shard1:27017', state: 1 },
  { _id: 'rs1', host: 'rs1/shard2:27017', state: 1 },
  { _id: 'rs2', host: 'rs2/shard3:27017', state: 1 }
]
```

---

## 🎯 Demonstrar pro Professor

### Teste 1: Criar Cliente via Interface
1. Abra `http://localhost:3000`
2. Preencha o formulário e clique "Cadastrar"
3. Cliente aparece na lista

### Teste 2: Ver Distribuição
Execute:
```powershell
docker exec mongos mongosh --eval "
use customers
print('👥 Clientes por Shard:')
db.customers.find({}, {nome:1, cpf:1}).forEach(doc => {
  print(doc.nome + ' -> CPF: ' + doc.cpf)
})
"
```

### Teste 3: Verificar Chunks
```powershell
docker exec mongos mongosh --eval "
use admin
db.chunks.find({ns: 'customers.customers'}).forEach(chunk => {
  const minCPF = chunk.min.cpf || 'MIN'
  const maxCPF = chunk.max.cpf || 'MAX'
  print('Shard: ' + chunk.shard + ' | Range: ' + minCPF + ' até ' + maxCPF)
})
"
```

### Teste 4: CRUD Completo

**Create:** Já feito (interface + seed)

**Read:** 
```powershell
# Via interface: clique em um cliente
# Via API:
curl http://localhost:3000/customers
```

**Update:**
```powershell
# Via interface: clique em editar
# Via API:
curl -X PUT http://localhost:3000/customers/<ID> `
  -H "Content-Type: application/json" `
  -d '{"email":"novo@email.com"}'
```

**Delete:**
```powershell
# Via interface: clique em deletar
# Via API:
curl -X DELETE http://localhost:3000/customers/<ID>
```

---

## 📊 Dados do Seed

10 clientes distribuídos automaticamente:

| CPF | Nome | Cidade | Shard Esperado |
|-----|------|--------|---|
| 111.111.111-11 | João Silva | São Paulo | rs0 |
| 222.222.222-22 | Maria Santos | Rio de Janeiro | rs0 |
| 333.333.333-33 | Carlos Mendes | Joinville | rs0 |
| 444.444.444-44 | Ana Costa | Fortaleza | rs0/rs1 |
| 555.555.555-55 | Pedro Oliveira | Belo Horizonte | rs1 |
| 666.666.666-66 | Lucas Ferreira | Porto Alegre | rs1 |
| 777.777.777-77 | Fernanda Alves | Salvador | rs1/rs2 |
| 888.888.888-88 | Ricardo Gomes | Brasília | rs2 |
| 999.999.999-99 | Juliana Martins | Recife | rs2 |
| 101.010.101-01 | Bruno Castro | Curitiba | rs2 |

---

## 🛠️ Troubleshooting

### Porta 3000 em uso
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB não conecta
```powershell
docker ps  # Verifica se containers estão rodando
docker logs mongos  # Ver logs
```

### Limpar tudo
```powershell
docker compose down
docker volume prune
docker compose up -d
# Depois refaz o init-sharding
```

---

## 📝 Arquivos Principais

```
moongoo/
├── docker-compose.yml           # 5 containers (3 shards + config + mongos)
├── scripts/
│   ├── init-sharding.sh        # Inicializa sharding
│   └── verify-sharding.sh      # Verifica distribuição
├── backend/
│   ├── seed.js                 # 10 clientes de teste
│   └── package.json            # npm run seed
├── frontend/
│   └── src/App.jsx             # Interface React
└── SETUP_COMPLETO.md           # Este arquivo
```

---

## ✅ Checklist Final

- [ ] Docker Compose rodando (5 containers)
- [ ] Sharding inicializado (sh.status() mostra 3 shards)
- [ ] Backend rodando em :3000
- [ ] Frontend rodando em :3000 (ou :3001)
- [ ] Seed executado (10 clientes criados)
- [ ] Distribuição verificada (clientes nos 3 shards)
- [ ] CRUD testado (criar, listar, editar, deletar)

**Pronto pra apresentar!** 🎉
