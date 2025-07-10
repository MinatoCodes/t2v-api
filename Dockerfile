# Use official Node.js 18 image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy entire project files including whisper binary
COPY . .

# Make whisper binary executable
RUN chmod +x /app/whisper

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "index.js"]
