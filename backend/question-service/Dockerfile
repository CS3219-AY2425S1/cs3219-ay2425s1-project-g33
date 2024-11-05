################
## BUILD STAGE ##
################
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

################
## PRODUCTION ##
################
FROM node:18-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY package*.json ./

RUN npm ci --only=production

EXPOSE 3002

# Change the CMD to use node directly instead of npm
CMD ["node", "dist/main.js"]