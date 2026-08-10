// Inicializar replica sets para config e shards
const { MongoClient } = require('mongodb');

const SERVICES = [
  { url: 'mongodb://config:27017/?directConnection=true', rsName: 'configrs', host: 'config:27017' },
  { url: 'mongodb://shard1:27017/?directConnection=true', rsName: 'rs0', host: 'shard1:27017' },
  { url: 'mongodb://shard2:27017/?directConnection=true', rsName: 'rs1', host: 'shard2:27017' },
  { url: 'mongodb://shard3:27017/?directConnection=true', rsName: 'rs2', host: 'shard3:27017' }
];

async function initReplicaSet(url, rsName, host) {
  let client;
  let retries = 0;
  const maxRetries = 30;

  while (retries < maxRetries) {
    try {
      client = new MongoClient(url, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000
      });
      await client.connect();
      const admin = client.db('admin');

      try {
        await admin.admin().command({ replSetGetStatus: 1 });
        await client.close();
        return true;
      } catch (err) {
        if (err.code === 94) {
          await admin.admin().command({
            replSetInitiate: {
              _id: rsName,
              members: [{ _id: 0, host: host }]
            }
          });
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        await client.close();
        return true;
      }
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  return false;
}

async function main() {
  for (const service of SERVICES) {
    const success = await initReplicaSet(service.url, service.rsName, service.host);
    if (!success) {
      process.exit(1);
    }
  }
  process.exit(0);
}

main();
