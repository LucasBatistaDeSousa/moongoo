#!/bin/bash

echo "[INIT] Starting sharding setup..."
sleep 15

mongosh --host mongos:27017 <<'EOF'
try {
  print("[INIT] Adding shard rs0...")
  var result1 = sh.addShard("rs0/shard1:27017")
  print(JSON.stringify(result1))

  print("[INIT] Adding shard rs1...")
  var result2 = sh.addShard("rs1/shard2:27017")
  print(JSON.stringify(result2))

  print("[INIT] Adding shard rs2...")
  var result3 = sh.addShard("rs2/shard3:27017")
  print(JSON.stringify(result3))

  print("[INIT] Enabling sharding on database...")
  var enableResult = sh.enableSharding("customers")
  print("[INIT] Enable result: " + JSON.stringify(enableResult))

  print("[INIT] Creating index on cpf...")
  var indexResult = db.getSiblingDB("customers").customers.createIndex({ cpf: 1 })
  print("[INIT] Index result: " + JSON.stringify(indexResult))

  print("[INIT] Sharding collection...")
  var shardResult = sh.shardCollection("customers.customers", { cpf: 1 })
  print("[INIT] Shard result: " + JSON.stringify(shardResult))

  // Wait for chunks to be created
  for (var i = 0; i < 10; i++) {
    var chunks = db.getSiblingDB("config").chunks.find({ ns: "customers.customers" }).toArray()
    print("[INIT] Iteration " + i + " - Chunks found: " + chunks.length)
    if (chunks.length > 0) {
      print("[INIT] ✓ Chunks created successfully!")
      break
    }
    sleep(1000)
  }

  exit(0)
} catch (error) {
  print("[INIT] ERROR: " + error)
  exit(1)
}
EOF

exit_code=$?
echo "[INIT] Sharding setup completed with exit code: $exit_code"
exit $exit_code
