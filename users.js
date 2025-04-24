const express = require('express');
require('dotenv').config();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const router = express.Router();

const USERS_DB = './users.json';
const SECRET_KEY = process.env.SECRET_KEY;

// ✅ Automatically create users.json if missing
if (!fs.existsSync(USERS_DB)) {
  fs.writeFileSync(USERS_DB, '[]');
}

// ✅ JWT Auth Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Access Denied: No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid or expired token');
  }
}

// ✅ File read/write helpers
function getUsers() {
  return JSON.parse(fs.readFileSync(USERS_DB));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));
}

// ✅ Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(password)) {
      return res.status(400).send("Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.");
    }

    const users = getUsers();
    if (users.find(user => user.username === username)) {
      return res.status(400).send('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    saveUsers(users);
    res.status(201).send('User registered successfully.');
  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).send("Something went wrong.");
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).send('Invalid username.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).send('Incorrect password.');

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).send("Something went wrong.");
  }
});

// ✅ Protected Dashboard Route
router.get('/dashboard', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));
});

// ✅ Token verification (used by frontend before showing dashboard)
router.get('/verify-token', verifyToken, (req, res) => {
  res.status(200).send("Token valid");
});

module.exports = router;
