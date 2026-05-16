const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user');
const logger = require('../config/logger');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// POST /v1/auth/login — Admin login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findByEmail(value.email);
    if (!user || !(await user.checkPassword(value.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET || 'dev-secret-change-in-production',
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${user.email} (${user.role})`);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /v1/auth/logout
router.post('/logout', (req, res) => {
  // JWT is stateless — client discards token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
