// .env configuration
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// libs
const jwt = require('jsonwebtoken');
// models
const user = require('../models/user');

// verification json web token
const verifyToken = async (req, res, next) => {
    try {
        var decoded = jwt.verify(req.cookies.sessionID, process.env.TOKEN_SEC, {
            maxAge: '480h',
        });
        await user.findOne({ email: decoded.email })
            .then(v => {
                if ((!v)
                    && decoded.port == v.serialPort
                    && v.isVerified)
                    throw Error();
            });
        req.user = decoded;
    } catch (err) {}
    next();
    return;
}

// OOP Exporter
module.exports = {
    verifyToken
}