# Use prebuilt whisper.cpp image with whisper binary
FROM ggerganov/whisper.cpp:latest

# Install Node.js 18
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

WORKDIR /app

# Copy package files and install Node dependencies
COPY package*.json ./
RUN npm install

# Copy your app code
COPY . .

# Download whisper model (if not already present in base image)
RUN mkdir -p /app/models && \
    wget -O /app/models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin

EXPOSE 3000

CMD ["npm", "start"]
