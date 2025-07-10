FROM node:18-buster

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    wget \
    build-essential \
    cmake \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone and build whisper.cpp using cmake
RUN git clone https://github.com/ggerganov/whisper.cpp /whisper.cpp && \
    cd /whisper.cpp && \
    mkdir build && cd build && \
    cmake .. && \
    make && \
    cp main /usr/local/bin/whisper

# Create models directory and download the model
RUN mkdir -p /app/models && \
    wget -O /app/models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy rest of the app code
COPY . .

# Expose app port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
