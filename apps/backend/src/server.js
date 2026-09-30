require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const config = require('./config/env');
const seedAdmin = require('./utils/seedAdmin');
const { authenticateToken } = require('./middleware/auth');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Behind the gateway + frontend nginx, so use X-Forwarded-For for the client IP
app.set('trust proxy', Number(process.env.TRUST_PROXY || 2));
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Configuration
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devops_platform';

// Middleware
app.use(compression());
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting (limits come from RATE_LIMIT_WINDOW_MS / RATE_LIMIT_MAX)
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Brute-force protection: only FAILED logins/signups count, per IP + email
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => `${req.ip}|${String(req.body?.email || '').toLowerCase()}`,
  message: {
    success: false,
    message: 'Too many failed attempts, please try again in 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(['/api/auth/login', '/api/auth/signup'], authLimiter);

// Logging middleware
app.use(morgan('combined'));

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected successfully');
  await seedAdmin();
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join a room for receiving updates
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });
  
  // Leave a room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });
  
  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

// Make socket.io instance available to routes
app.set('io', io);

// Import routes
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const monitoringRoutes = require('./routes/monitoring');
const logsRoutes = require('./routes/logs');
const settingsRoutes = require('./routes/settings');

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
// Everything below needs a valid login token
app.use('/api/services', authenticateToken, servicesRoutes);
app.use('/api/monitoring', authenticateToken, monitoringRoutes);
app.use('/api/logs', authenticateToken, logsRoutes);
app.use('/api/settings', authenticateToken, settingsRoutes);

// Health check endpoint (public)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    service: 'devops-platform-backend',
    version: '1.0.0',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`MongoDB URI: ${MONGODB_URI}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server, io };
