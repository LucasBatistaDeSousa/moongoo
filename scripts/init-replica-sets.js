// Inicializar replica sets para config e shards
const { MongoClient } = require('mongodb');

const SERVICES = [
  { url: 'mongodb://config:27017', rsName: 'configrs', name: 'config' },
  { url: 'mongodb://shard1:27017', rsName: 'rs0', name: 'shard1' },
  { url: 'mongodb://shard2:27017', rsName: 'rs1', name: 'shard2' },
  { url: 'mongodb://shard3:27017', rsName: 'rs2', name: 'shard3' }
];

async function initReplicaSet(url, rsName) {
  let client;
  let retries = 0;
  const maxRetries = 20;

  while (retries < maxRetries) {
    try {
      client = new MongoClient(url, { serverSelectionTimeoutMS: 2000 });
      await client.connect();

      const admin = client.db('admin');

      try {
        const status = await admin.admin().command({ replSetGetStatus: 1 });
        await client.close();
        return true;
      } catch (err) {
        if (err.code === 94) {
          await admin.admin().command({
            replSetInitiate: {
              _id: rsName,
              members: [{ _id: 0, host: '127.0.0.1:27017' }]
            }
          });
        }
        await client.close();
        return true;
      }
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  return false;
}

async function main() {
  for (const service of SERVICES) {
    const success = await initReplicaSet(service.url, service.rsName);
    if (!success) {
      process.exit(1);
    }
  }
  process.exit(0);
}

main();
