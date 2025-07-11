// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Prioritize role
        let prioritizedRole = 'user';
        if (user.user_roles.includes('mentor')) prioritizedRole = 'mentor';
        else prioritizedRole = user.user_roles[0] || 'user';

        // Create token
        const token = jwt.sign(
            { id: user._id, role: prioritizedRole },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response
        res.json({
            token,
            userDetails: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            role: prioritizedRole,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /auth/signup
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      user_roles: ['candidate'],
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

// POST /auth/check-email
exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: 'Error checking email' });
  }
};