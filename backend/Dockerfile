FROM node:20

WORKDIR /FormValidation/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]