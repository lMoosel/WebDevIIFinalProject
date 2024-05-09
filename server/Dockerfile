# Use the official Node.js image as base
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run seed

# Expose the port the app runs on
EXPOSE 4000

# Command to run the application
CMD ["npm", "start"]
