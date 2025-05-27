FROM node:latest as development
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install -g @nestjs/cli
COPY . .
RUN npx prisma generate
CMD [ "npm", "run", "start:dev" ]

FROM node:alpine as production
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install -g @nestjs/cli
COPY . .
RUN npx prisma generate
RUN npm run build
CMD [ "npm", "run", "start:prod" ]
