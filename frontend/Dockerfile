# Development stage
FROM node:20 AS dev

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Expose port
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]

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
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
