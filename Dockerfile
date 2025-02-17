FROM node:18-slim

WORKDIR /app

COPY package.json ./

RUN rm -f package-lock.json && \
    npm install --force && \
    npm cache clean --force

# Fajlok masolasa
COPY . .

# Vite.conf -ban megadott port
EXPOSE 3000

CMD [ "npm", "run", "dev"]