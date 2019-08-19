FROM node:10

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install express

COPY . .

EXPOSE 80

CMD ["npm", "start"]