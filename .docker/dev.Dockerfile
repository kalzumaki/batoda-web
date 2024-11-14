# Use the official Node.js 23-alpine image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies, including specific versions of react and react-dom
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the container
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development

# Install nodemon globally for development
RUN npm install -g nodemon

# Command to start the application with nodemon
CMD ["nodemon", "-L", "--exec", "npm run dev"]
