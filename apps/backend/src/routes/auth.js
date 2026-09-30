const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const config = require('../config/env');
const User = require('../models/User');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ userId: user.id, email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

const fail = (res, status, message) => res.status(status).json({ success: false, message });

// Returns an error message, or null when the input is fine
const validateNewUser = ({ name, email, password }) => {
  if (![name, email, password].every((v) => typeof v === 'string' && v.trim())) {
    return 'Name, email and password are required';
  }
  if (!validator.isEmail(email)) return 'Please enter a valid email address';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 72) return 'Password must be at most 72 characters';
  return null;
};

const createUser = async ({ name, email, password, role }) =>
  User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: await bcrypt.hash(password, 10),
    role: role === 'admin' ? 'admin' : 'user',
  });

const handleCreateError = (err, res, label) => {
  if (err.code === 11000) return fail(res, 409, 'A user with this email already exists');
  console.error(`${label} error:`, err);
  return fail(res, 500, 'Internal server error');
};

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return fail(res, 400, 'Email and password are required');
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return fail(res, 401, 'Invalid email or password');

    user.lastLoginAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token: signToken(user), user: user.toPublic() },
    });
  } catch (err) {
    console.error('Login error:', err);
    fail(res, 500, 'Internal server error');
  }
});

// Public sign up - always creates a normal "user" (role in the body is ignored)
router.post('/signup', async (req, res) => {
  try {
    const problem = validateNewUser(req.body);
    if (problem) return fail(res, 400, problem);

    const user = await createUser({ ...req.body, role: 'user' });
    res.status(201).json({
      success: true,
      message: 'Account created',
      data: { token: signToken(user), user: user.toPublic() },
    });
  } catch (err) {
    handleCreateError(err, res, 'Signup');
  }
});

// Admin only - add a user and choose their role
router.post('/register', authenticateToken, isAdmin, async (req, res) => {
  try {
    const problem = validateNewUser(req.body);
    if (problem) return fail(res, 400, problem);

    const user = await createUser(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: user.toPublic() },
    });
  } catch (err) {
    handleCreateError(err, res, 'Register');
  }
});

// Logout (stateless JWT - the client just drops the token)
router.post('/logout', (req, res) => {
  res.status(200).json({ success: true, message: 'Logout successful' });
});

// Current user, read from the database
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return fail(res, 401, 'User no longer exists');
    res.status(200).json({ success: true, data: user.toPublic() });
  } catch (err) {
    console.error('Me error:', err);
    fail(res, 500, 'Internal server error');
  }
});

// Admin only - list all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users.map((u) => u.toPublic()) });
  } catch (err) {
    console.error('List users error:', err);
    fail(res, 500, 'Internal server error');
  }
});

// Admin only - delete a user (not yourself, not the last admin)
router.delete('/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (id === req.user.userId) return fail(res, 400, 'You cannot delete your own account');

    const target = await User.findById(id);
    if (!target) return fail(res, 404, 'User not found');
    if (target.role === 'admin' && (await User.countDocuments({ role: 'admin' })) <= 1) {
      return fail(res, 400, 'Cannot delete the last admin');
    }

    await target.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) {
    if (err.name === 'CastError') return fail(res, 400, 'Invalid user id');
    console.error('Delete user error:', err);
    fail(res, 500, 'Internal server error');
  }
});

module.exports = router;
