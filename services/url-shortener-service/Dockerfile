FROM node:latest as development
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install -g @nestjs/cli
COPY . .
CMD [ "npm", "run", "start:dev" ]

FROM node:alpine as production
WORKDIR /app
COPY package*.json .
RUN npm install
RUN npm install -g @nestjs/cli
COPY . .
RUN npm run build
CMD [ "npm", "run", "start:prod" ]
