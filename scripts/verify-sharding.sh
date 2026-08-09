#!/bin/bash

# Script para verificar a distribuição de dados entre os shards

echo "📊 ============================================"
echo "   VERIFICAÇÃO DE DISTRIBUIÇÃO DE SHARDING"
echo "============================================"
echo ""

echo "🔍 Status do Cluster:"
docker exec mongos mongosh --eval "
use admin
sh.status()
"

echo ""
echo "📍 Distribuição de Clientes por Shard:"
docker exec mongos mongosh --eval "
use customers
const chunks = db.chunks.find({ns: 'customers.customers'}).toArray();
chunks.forEach(chunk => {
  const minCPF = chunk.min.cpf ? chunk.min.cpf : 'MIN';
  const maxCPF = chunk.max.cpf ? chunk.max.cpf : 'MAX';
  const count = db.customers.countDocuments({cpf: {'\$gte': minCPF, '\$lt': maxCPF}});
  print('Shard: ' + chunk.shard + ' | Range: ' + minCPF + ' até ' + maxCPF + ' | Documentos: ' + count);
});
"

echo ""
echo "👥 Lista de Clientes por Shard:"
docker exec mongos mongosh --eval "
use customers
db.customers.find({}, {nome: 1, cpf: 1, _id: 0}).forEach(doc => {
  print(doc.nome.padEnd(20) + ' | CPF: ' + doc.cpf);
});
"

echo ""
echo "✅ Verificação concluída!"
