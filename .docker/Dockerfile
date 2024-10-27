# Use a lightweight Node.js image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) for dependency installation
COPY package*.json ./

# Install only production dependencies for smaller builds
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment variables for Next.js
ENV NODE_ENV=production

# Run the build script
RUN npm run build

# Start the application in production mode
CMD ["npm", "run", "start"]
