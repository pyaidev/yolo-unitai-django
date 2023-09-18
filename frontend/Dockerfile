# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

ARG REACT_APP_API

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the React app
RUN npm run build

# Expose the port the application runs on (assuming React uses port 3000)
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]