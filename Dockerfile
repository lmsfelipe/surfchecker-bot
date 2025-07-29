FROM node:24.4-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the application
RUN npm run build

EXPOSE 9080

# Use production build
CMD ["npm", "start"]
