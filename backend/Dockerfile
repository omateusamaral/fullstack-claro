# Build stage
FROM node:24.22.1-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --global npm@12.2.1

RUN npm ci

COPY . .

RUN npm run build

# Runtime stage
FROM node:24.22.1-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --global npm@12.2.1

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]