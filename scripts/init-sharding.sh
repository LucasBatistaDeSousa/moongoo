#!/bin/bash

sleep 10

mongosh --host mongos:27017 <<'EOF'
// Adicionar shards
sh.addShard("rs0/shard1:27017")
sh.addShard("rs1/shard2:27017")
sh.addShard("rs2/shard3:27017")

// Habilitar sharding no database
sh.enableSharding("customers")

// Criar index na collection
db.getSiblingDB("customers").customers.createIndex({ cpf: 1 })

// Fazer sharding da collection
sh.shardCollection("customers.customers", { cpf: 1 })

// Aguardar chunks serem criados
var chunks = db.getSiblingDB("config").chunks.find({ ns: "customers.customers" }).toArray()
print("Total chunks: " + chunks.length)

exit(0)
EOF
