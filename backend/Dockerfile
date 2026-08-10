FROM node:20-alpine as builder

WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json ./
RUN npm install

# Copiar código
COPY src ./src
COPY tsconfig.json ./

# Build
RUN npm run build

# ============================================
# Stage 2: Runtime
# ============================================
FROM node:20-alpine

WORKDIR /app

# Instalar apenas dependências de produção
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist

# Copiar seed
COPY seed.js ./

EXPOSE 3000

# Rodar API + seed automático
CMD sh -c "node dist/main.js > /dev/null 2>&1 & sleep 15 && node seed.js > /dev/null 2>&1"
