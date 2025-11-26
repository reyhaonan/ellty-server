FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and config files
COPY tsconfig.json ./
COPY src ./src

# Build with error checking
RUN pnpm build
RUN ls -la dist/

FROM node:20-alpine
WORKDIR /app
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Install PM2 globally
RUN npm install -g pm2

EXPOSE 3000
CMD ["pm2-runtime", "dist/index.js"]