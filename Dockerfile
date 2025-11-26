# ---------- Base Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack so pnpm works
RUN corepack enable

# Copy only dependency files first
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./

# Install all deps (dev + prod) for building
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript + aliases
RUN pnpm build


# ---------- Production Image ----------
FROM node:20-alpine

WORKDIR /app
RUN corepack enable

# Copy only prod package files
COPY package.json pnpm-lock.yaml ./

# Install only production deps
RUN pnpm install --prod

# Install PM2 globally
RUN pnpm add -g pm2

# Copy built output
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pm2-runtime", "dist/index.js"]
