# Use official Node.js LTS image with Debian Buster
FROM node:18-buster

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    build-essential \
    cmake \
    git \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

# Clone whisper.cpp with submodules and build using cmake
RUN git clone --recurse-submodules https://github.com/ggerganov/whisper.cpp /whisper.cpp && \
    cd /whisper.cpp && \
    mkdir build && cd build && \
    cmake .. && \
    make && \
    cp main /usr/local/bin/whisper

# Create models directory and download the ggml-base.en.bin model
RUN mkdir -p /app/models && \
    wget -O /app/models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
