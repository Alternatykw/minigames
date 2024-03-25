// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB connection setup
mongoose.connect('mongodb://127.0.0.1:27017/minigames')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Import the User model
const User = require('./models/User');

// Route for handling user registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

     // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user instance with hashed password
    const newUser = new User({ username, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
