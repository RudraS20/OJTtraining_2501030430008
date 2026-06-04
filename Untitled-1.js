// server.js
const express = require('express');
const bcrypt  = require('bcrypt');
const { body, validationResult } = require('express-validator');

const app  = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory store — swap with your DB (MongoDB, PostgreSQL, etc.)
const users = [];

app.post(
  '/api/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').notEmpty().withMessage('Role is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, role } = req.body;

    // Check for existing user
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = { id: Date.now(), firstName, lastName, email, passwordHash, role };
    users.push(user);

    res.status(201).json({ message: 'Account created successfully', userId: user.id });
  }
);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));