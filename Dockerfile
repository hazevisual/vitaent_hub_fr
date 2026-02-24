# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application with Vite only (skip TypeScript compilation)
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app

# Install serve to run the built app
RUN npm install -g serve

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Create non-root user for security
RUN addgroup -g 1001 appuser && \
    adduser -D -u 1001 -G appuser appuser
USER appuser

EXPOSE 3001

# Serve the dist folder
CMD ["serve", "-s", "dist", "-l", "3001"]
