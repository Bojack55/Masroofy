const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        req.user = user; // attach user to request
        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).json({ success: false, message: 'Token verification failed' });
    }
};
