# Use an official Node.js runtime as a parent image
FROM node:24-bookworm-slim AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

ARG REACT_APP_API

# Install dependencies
RUN npm ci --ignore-scripts --no-audit --no-fund

# Copy the current directory contents into the container
COPY . .

# Build the React app
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
