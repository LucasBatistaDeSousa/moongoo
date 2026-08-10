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

# Rodar API
CMD node dist/main.js
