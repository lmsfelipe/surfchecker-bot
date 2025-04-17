FROM node:21

# Install Chrome dependencies and Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    wget \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

# Build the application
RUN npm run build \
    && chown -R pptruser:pptruser /app

# Switch to non-root user
USER pptruser

EXPOSE 8080

CMD ["npm", "run", "dev"]
