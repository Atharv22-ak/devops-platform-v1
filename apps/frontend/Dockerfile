# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration as a template (rendered at container start)
COPY nginx.conf /etc/nginx/nginx.conf.template

# Expose port
EXPOSE 80

# Render the template at start. Only BACKEND_HOST / BACKEND_PORT are substituted,
# so nginx's own variables ($host, $uri, $scheme, ...) are left untouched.
CMD ["sh", "-c", "envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]