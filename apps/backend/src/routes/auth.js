const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/env');

// Mock user database (in real app, this would be actual database queries)
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeGjZHcjrKxaBCx3TgJonSFy6ytE0VjBy', // password: password123
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeGjZHcjrKxaBCx3TgJonSFy6ytE0VjBy', // password: password123
    role: 'user',
    name: 'Regular User'
  }
];

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    // Return user info (without password) and token
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Register route (adds a new user)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(users.length + 1),
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
      name
    };
    users.push(newUser);

    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout route (client should remove token)
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// Get current user info (protected route)
router.get('/me', (req, res) => {
  // In real app, would verify token and fetch user from DB
  // For demo, returning mock data
  res.status(200).json({
    success: true,
    data: {
      id: '1',
      email: 'admin@example.com',
      role: 'admin',
      name: 'Admin User'
    }
  });
});

module.exports = router;