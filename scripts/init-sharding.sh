#!/bin/bash

# Script para inicializar sharding no MongoDB

echo "🔄 Aguardando inicialização dos containers..."
sleep 10

echo "📋 Iniciando replica sets..."

# Inicializar Shard 1
docker exec shard1 mongosh --eval "
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'shard1:27017' }]
})"

# Inicializar Shard 2
docker exec shard2 mongosh --eval "
rs.initiate({
  _id: 'rs1',
  members: [{ _id: 0, host: 'shard2:27017' }]
})"

# Inicializar Shard 3
docker exec shard3 mongosh --eval "
rs.initiate({
  _id: 'rs2',
  members: [{ _id: 0, host: 'shard3:27017' }]
})"

# Inicializar Config Server
docker exec config mongosh --eval "
rs.initiate({
  _id: 'configrs',
  members: [{ _id: 0, host: 'config:27017' }]
})"

echo "⏳ Aguardando inicialização dos replica sets..."
sleep 10

echo "🔗 Adicionando shards ao mongos..."

# Adicionar shards ao mongos
docker exec mongos mongosh --eval "
sh.addShard('rs0/shard1:27017');
sh.addShard('rs1/shard2:27017');
sh.addShard('rs2/shard3:27017');
"

echo "📊 Habilitando sharding no banco de dados..."

docker exec mongos mongosh --eval "
use customers;
sh.enableSharding('customers');
sh.shardCollection('customers.customers', { cpf: 1 });
"

echo "✅ Sharding inicializado com sucesso!"
echo ""
echo "📌 Informações do Cluster:"
docker exec mongos mongosh --eval "
use admin;
sh.status();
"
