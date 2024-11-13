

FROM node:23-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development


RUN npm install -g nodemon
CMD ["nodemon", "-L", "--exec", "npm run dev"]

