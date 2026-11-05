// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const appEmitter = require('../eventEmitter');

// In-memory user store (can be replaced by MongoDB/Mongoose models)
const users = [];

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: crypto.randomBytes(12).toString('hex'),
      username,
      email,
      password: hashedPassword,
      role: 'user'
    };

    users.push(newUser);

    // Emit registration event
    appEmitter.emit('user:registered', newUser);

    // Matches Fig 1 signup response
    return res.status(201).json({
      message: 'User registered',
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during signup', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // Matches Fig 1 login response
    return res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

module.exports = { router, users };