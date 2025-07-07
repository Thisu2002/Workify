const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password'); // exclude password
        if (!req.user) return res.status(404).json({ message: 'User not found' });
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
