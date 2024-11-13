#################
## DEVELOPMENT ##
#################
FROM ubuntu:20.04 AS development

# Set environment variables to prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install Python 3, pip, Java, and Node.js
RUN apt-get update && \
    apt-get install -y \
    python3 python3-pip openjdk-11-jdk curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify installations
RUN python3 --version && java -version && node --version

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app to the /dist folder
RUN npm run build

# Expose the port the app runs on
EXPOSE 4000

# Run the application in development mode
CMD ["npm", "run", "start:dev"]


################
## PRODUCTION ##
################
FROM ubuntu:20.04 AS production

# Set environment variables to prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install only runtime dependencies (Node.js, Python, and Java)
RUN apt-get update && \
    apt-get install -y \
    python3 openjdk-11-jdk curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the build artifacts from the development stage
COPY --from=development /app/dist ./dist
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 4000

# Run the main application
CMD ["node", "dist/main"]