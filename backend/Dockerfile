# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies and build
RUN npm install && npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
