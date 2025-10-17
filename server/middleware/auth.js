const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No auth token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // Make sure we're setting the user ID
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Token is invalid' });
    }
};

module.exports = auth;
