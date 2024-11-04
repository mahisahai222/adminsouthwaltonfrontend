FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Step 2: Serve the application
FROM node:18-alpine

# Install a lightweight HTTP server to serve the static files
RUN npm install -g serve

# Set the working directory and copy the build files from the previous stage
WORKDIR /app
COPY --from=builder /app/build .

# Expose port 3000 for the server
EXPOSE 2023

# Start the server using the "serve" command
CMD ["serve", "-s", ".", "-l", "2023"]
