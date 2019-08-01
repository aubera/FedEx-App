FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000 4200
CMD [ "forever", "start", "server.js"  ]
