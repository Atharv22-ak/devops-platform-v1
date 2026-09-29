// Environment configuration
const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/devops_platform',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  
  // File upload limits
  fileUploadLimit: parseInt(process.env.FILE_UPLOAD_LIMIT) || 10 * 1024 * 1024, // 10 MB
  
  // Pagination
  defaultLimit: parseInt(process.env.DEFAULT_LIMIT) || 20,
  maxLimit: parseInt(process.env.MAX_LIMIT) || 100,
};

module.exports = config;
