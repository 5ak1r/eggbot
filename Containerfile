FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN adduser -D appuser && chown appuser --recursive /app
USER appuser

CMD ["node", "index.js"]