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
