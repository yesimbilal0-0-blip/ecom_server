const asynchandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const signToken = (user) => {
    return jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const validateToken = asynchandler( async(req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7, authHeader.length);
    }
    if (!token) {
        return res.status(401).json({ message: 'You are not authenticated.' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        req.user = decoded;
        next();
    })
})

module.exports = { signToken, validateToken };