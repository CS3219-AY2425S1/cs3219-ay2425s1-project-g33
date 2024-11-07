#################
## DEVELOPMENT ##
#################
FROM node:18-alpine AS development

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Built the app to /dist folder
RUN npm run build

# Expose the port the app runs on
EXPOSE 4000

################
## PRODUCTION ##
################
FROM node:18-alpine AS production

# Set node environment to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the previous build stage
COPY --from=development /peerprep/app/dist ./dist
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 4000

# Run the main file
CMD ["node", "dist/main"]