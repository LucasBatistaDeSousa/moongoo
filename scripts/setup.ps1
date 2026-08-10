# Script de Setup Automático - MongoDB Sharding + React + NestJS
# Execute: powershell -ExecutionPolicy Bypass -File scripts/setup.ps1

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 SETUP AUTOMÁTICO - MongoDB Sharding com React + NestJS   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Cores
$Success = "Green"
$Error = "Red"
$Info = "Yellow"

# ============================================
# PASSO 1: Docker Compose
# ============================================
Write-Host "📦 PASSO 1: Iniciando Docker Compose..." -ForegroundColor $Info

docker compose down 2>$null
Start-Sleep -Seconds 2

docker compose up -d
if ($?) {
    Write-Host "✅ Containers iniciados com sucesso" -ForegroundColor $Success
} else {
    Write-Host "❌ Erro ao iniciar containers" -ForegroundColor $Error
    exit 1
}

Write-Host "⏳ Aguardando 20 segundos para containers iniciarem..." -ForegroundColor $Info
Start-Sleep -Seconds 20

# ============================================
# PASSO 2: Inicializar Replica Sets
# ============================================
Write-Host ""
Write-Host "🔄 PASSO 2: Inicializando Replica Sets..." -ForegroundColor $Info

Write-Host "  → Inicializando rs0 (Shard 1)..." -ForegroundColor $Info
docker exec -it shard1 mongosh --eval "rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'shard1:27017'}]})" 2>$null
Start-Sleep -Seconds 5

Write-Host "  → Inicializando rs1 (Shard 2)..." -ForegroundColor $Info
docker exec -it shard2 mongosh --eval "rs.initiate({_id: 'rs1', members: [{_id: 0, host: 'shard2:27017'}]})" 2>$null
Start-Sleep -Seconds 5

Write-Host "  → Inicializando rs2 (Shard 3)..." -ForegroundColor $Info
docker exec -it shard3 mongosh --eval "rs.initiate({_id: 'rs2', members: [{_id: 0, host: 'shard3:27017'}]})" 2>$null
Start-Sleep -Seconds 5

Write-Host "  → Inicializando Config Server..." -ForegroundColor $Info
docker exec -it config mongosh --eval "rs.initiate({_id: 'configrs', members: [{_id: 0, host: 'config:27017'}]})" 2>$null
Start-Sleep -Seconds 15

Write-Host "✅ Replica Sets inicializados" -ForegroundColor $Success

# ============================================
# PASSO 3: Adicionar Shards
# ============================================
Write-Host ""
Write-Host "🔗 PASSO 3: Adicionando Shards ao Mongos..." -ForegroundColor $Info

docker exec mongos mongosh --eval "
sh.addShard('rs0/shard1:27017');
sh.addShard('rs1/shard2:27017');
sh.addShard('rs2/shard3:27017');
" 2>$null

Start-Sleep -Seconds 5

# ============================================
# PASSO 4: Habilitar Sharding
# ============================================
Write-Host "📊 PASSO 4: Habilitando Sharding na Collection..." -ForegroundColor $Info

docker exec mongos mongosh --eval "
use customers;
sh.enableSharding('customers');
sh.shardCollection('customers.customers', { cpf: 1 });
" 2>$null

Start-Sleep -Seconds 3
Write-Host "✅ Sharding habilitado" -ForegroundColor $Success

# ============================================
# PASSO 5: Verificar Status
# ============================================
Write-Host ""
Write-Host "🔍 PASSO 5: Verificando Status do Cluster..." -ForegroundColor $Info

docker exec mongos mongosh --eval "use admin; sh.status()" 2>$null

# ============================================
# PASSO 6: Instalar Dependências
# ============================================
Write-Host ""
Write-Host "📦 PASSO 6: Instalando Dependências..." -ForegroundColor $Info

Write-Host "  → Backend..." -ForegroundColor $Info
Push-Location backend
npm install --silent 2>$null
Pop-Location
Write-Host "✅ Backend" -ForegroundColor $Success

Write-Host "  → Frontend..." -ForegroundColor $Info
Push-Location frontend
npm install --silent 2>$null
Pop-Location
Write-Host "✅ Frontend" -ForegroundColor $Success

# ============================================
# RESUMO
# ============================================
Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor $Success
Write-Host "║  ✅ SETUP COMPLETO! Tudo pronto para começar                 ║" -ForegroundColor $Success
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor $Success
Write-Host ""
Write-Host "📋 Próximos Passos:" -ForegroundColor $Info
Write-Host ""
Write-Host "1️⃣  Backend (Terminal 1):" -ForegroundColor $Info
Write-Host "    cd backend" -ForegroundColor "White"
Write-Host "    npm run start:dev" -ForegroundColor "White"
Write-Host ""
Write-Host "2️⃣  Frontend (Terminal 2):" -ForegroundColor $Info
Write-Host "    cd frontend" -ForegroundColor "White"
Write-Host "    npm start" -ForegroundColor "White"
Write-Host ""
Write-Host "3️⃣  Seed (Terminal 3):" -ForegroundColor $Info
Write-Host "    cd backend" -ForegroundColor "White"
Write-Host "    npm run seed" -ForegroundColor "White"
Write-Host ""
Write-Host "4️⃣  Ver Distribuição:" -ForegroundColor $Info
Write-Host "    docker exec mongos mongosh --eval 'use admin; sh.status()'" -ForegroundColor "White"
Write-Host ""
Write-Host "📖 Para mais info, veja SETUP_COMPLETO.md" -ForegroundColor $Info
Write-Host ""
