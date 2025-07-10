# Use official Node.js 18 image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the entire project files into /app
COPY . .

# Make your whisper binary executable
RUN chmod +x /app/whisper

# Expose port 3000 (change if your index.js uses a different port)
EXPOSE 3000

# Start your server
CMD ["node", "index.js"]
