const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ 'msg': 'no token, authorization denied...' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));// check if active or expired.
        req.user = decoded.user; // if token active
        next();
    } catch (err) { // if token expired.
        res.status(401).json({ msg: 'token is not valid...' })
    }
}