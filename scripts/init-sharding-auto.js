// Script de inicialização automática do sharding
// Roda quando o container mongos inicia

const { MongoClient } = require('mongodb');

const MONGOS_URL = 'mongodb://mongos:27017';
const MAX_RETRIES = 10;
const RETRY_DELAY = 3000;

async function initSharding() {
  let client;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      client = new MongoClient(MONGOS_URL);
      await client.connect();

      const admin = client.db('admin');

      // Adicionar shards
      await admin.admin().command({ addShard: 'rs0/shard1:27017' });
      await admin.admin().command({ addShard: 'rs1/shard2:27017' });
      await admin.admin().command({ addShard: 'rs2/shard3:27017' });

      // Habilitar sharding
      const customersDb = client.db('customers');
      await customersDb.admin().command({ enableSharding: 'customers' });

      // Drop existing indexes before creating shard key index
      try {
        const customersCollection = customersDb.collection('customers');
        const indexes = await customersCollection.listIndexes().toArray();
        for (const index of indexes) {
          if (index.key.cpf === 1 || index.key.cpf === -1) {
            await customersCollection.dropIndex(index.name);
          }
        }
      } catch (indexError) {
        // Index cleanup error - can be normal
      }

      // Create shard key index
      await customersDb.collection('customers').createIndex({ cpf: 1 }, { sparse: true });

      await customersDb.admin().command({
        shardCollection: 'customers.customers',
        key: { cpf: 1 }
      });

      await client.close();
      process.exit(0);
    } catch (error) {
      retries++;
      if (retries < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        process.exit(1);
      }
    }
  }
}

initSharding();
