#!/bin/bash

echo "🔍 Verificando distribuição nos shards..."
docker exec mongos mongosh --eval "
  const db = connect('mongodb://localhost:27017/customers');
  const sharding = db.admin().command('shStatus');

  console.log('📊 Status do Sharding:');
  console.log('');

  db.customers.find().forEach(doc => {
    console.log(doc.nome.padEnd(20) + ' | CPF: ' + doc.cpf + ' | ID: ' + doc._id);
  });

  console.log('');
  console.log('🔗 Shards:');
  const status = db.admin().command('sh.status()');
"
