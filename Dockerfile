# Use official Node.js 18 base image with Debian Buster
FROM node:18-buster

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    build-essential \
    cmake \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone and build whisper.cpp
RUN git clone https://github.com/ggerganov/whisper.cpp /whisper.cpp && \
    cd /whisper.cpp && \
    make && \
    cp main /usr/local/bin/whisper

# Create models directory and download the model
RUN mkdir -p /app/models && \
    wget -O /app/models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if any)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Start your app
CMD ["npm", "start"]
