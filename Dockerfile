FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY tsconfig.paths.json ./

COPY . .

RUN pnpm install

RUN pnpm build

FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

RUN pnpm add -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "dist/index.js"]
