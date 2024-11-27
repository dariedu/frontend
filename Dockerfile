FROM node:20.11.1-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

ENV CI=true
ENV HOST=0.0.0.0
ENV PORT=4173

CMD ["sh", "-c", "npm run preview -- --host $HOST --port $PORT"]
