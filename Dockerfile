FROM node:14.15.4-slim

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
