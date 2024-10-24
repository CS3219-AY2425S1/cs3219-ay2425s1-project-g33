# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (default is 3000 for Next.js)
EXPOSE 3000

# Start Next.js in development mode with hot-reloading
CMD ["npm", "run", "dev"]