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
      console.log(`[${new Date().toISOString()}] Conectando ao Mongos (tentativa ${retries + 1}/${MAX_RETRIES})...`);

      client = new MongoClient(MONGOS_URL);
      await client.connect();
      console.log('✅ Conectado ao Mongos');

      const admin = client.db('admin');

      // Adicionar shards
      console.log('🔗 Adicionando shards...');
      await admin.admin().command({ addShard: 'rs0/shard1:27017' });
      console.log('✅ Shard 1 adicionado');

      await admin.admin().command({ addShard: 'rs1/shard2:27017' });
      console.log('✅ Shard 2 adicionado');

      await admin.admin().command({ addShard: 'rs2/shard3:27017' });
      console.log('✅ Shard 3 adicionado');

      // Habilitar sharding
      console.log('📊 Habilitando sharding na collection...');
      const customersDb = client.db('customers');
      await customersDb.admin().command({ enableSharding: 'customers' });
      console.log('✅ Sharding habilitado no banco');

      // Drop existing CPF indexes before creating shard key index
      try {
        const customersCollection = customersDb.collection('customers');
        const indexes = await customersCollection.listIndexes().toArray();
        for (const index of indexes) {
          if (index.key.cpf === 1 || index.key.cpf === -1) {
            await customersCollection.dropIndex(index.name);
            console.log(`✅ Índice existente removido: ${index.name}`);
          }
        }
      } catch (indexError) {
        console.log(`⚠️  Erro ao remover índices antigos (pode ser normal): ${indexError.message}`);
      }

      // Create shard key index
      await customersDb.collection('customers').createIndex({ cpf: 1 }, { sparse: true });
      console.log('✅ Índice de sharding criado');

      await customersDb.admin().command({
        shardCollection: 'customers.customers',
        key: { cpf: 1 }
      });
      console.log('✅ Collection sharding habilitado');

      // Ver status
      console.log('');
      console.log('🎉 SHARDING INICIALIZADO COM SUCESSO!');
      console.log('');
      const status = await admin.admin().command({ sharstatus: 1 });
      console.log('Status:', JSON.stringify(status, null, 2));

      await client.close();
      process.exit(0);
    } catch (error) {
      retries++;
      if (retries < MAX_RETRIES) {
        console.log(`⏳ Erro: ${error.message}`);
        console.log(`⏳ Aguardando ${RETRY_DELAY / 1000}s antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.error('❌ Falha ao inicializar sharding após múltiplas tentativas');
        console.error(error);
        process.exit(1);
      }
    }
  }
}

initSharding();
