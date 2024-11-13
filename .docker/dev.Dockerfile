
FROM node:23-alpine


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install

COPY . .


EXPOSE 3000


ENV NODE_ENV=development


CMD ["npm", "run", "dev"]
