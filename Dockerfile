FROM node:alpine

WORKDIR "/dock-hand"

COPY package.json .

RUN npm install

COPY . .


CMD ["npm", "run", "start"]