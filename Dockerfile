FROM node:alpine

WORKDIR "/dock-hand"

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5642

CMD ["npm", "run", "start"]