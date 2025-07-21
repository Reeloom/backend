# Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm nodemon
RUN pnpm install --frozen-lockfile --prod=false

COPY prisma ./prisma
COPY src ./src
COPY .env.local ./
COPY tsconfig.json ./
COPY . .

RUN pnpm prisma generate



EXPOSE 3000

CMD ["nodemon", "--watch", "src", "src/server.ts"]