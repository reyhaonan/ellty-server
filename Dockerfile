FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

ENV NODE_ENV=PRODUCTION

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/index.js"]
