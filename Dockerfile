FROM node:21

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

# Build the application
RUN npm run build

EXPOSE 9080

CMD ["npm", "run", "dev"]
