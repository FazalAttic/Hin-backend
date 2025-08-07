# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose the port (change if needed)
EXPOSE 5000

# Use nodemon for development
CMD ["npx", "nodemon", "app.js"]
