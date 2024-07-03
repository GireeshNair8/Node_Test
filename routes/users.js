const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).send('User already exists.');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  res.send('User registered successfully.');
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

// Check if user exists
const user = await User.findOne({ email });
if (!user) return res.status(400).send('Invalid email or password.');

// Compare passwords
const validPassword = await bcrypt.compare(password, user.password);
if (!validPassword) return res.status(400).send('Invalid email or password.');

// Generate JWT token
const token = jwt.sign({ _id: user._id }, 'secret_key');
res.header('auth-token', token).send(token);
});

// List all users (secured)
router.get('/', verifyToken, async (req, res) => {
const users = await User.find({}, '-password');
res.send(users);
});

// View user details (secured)
router.get('/:id', verifyToken, async (req, res) => {
const user = await User.findById(req.params.id, '-password');
if (!user) return res.status(404).send('User not found.');
res.send(user);
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
const token = req.header('auth-token');
if (!token) return res.status(401).send('Access denied.');
   try {
  const verified = jwt.verify(token, 'secret_key');
  req.user = verified;
  next();
} catch (err) {
  res.status(400).send('Invalid token.');
}
}