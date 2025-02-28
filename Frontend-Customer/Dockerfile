# Use the official Node.js image as the base image for building the React app
  FROM node:14 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
  COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
    COPY . .
  
# Build the React app
RUN npm run build

# Use the official Nginx image to serve the React app
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]