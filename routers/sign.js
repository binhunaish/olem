// .env configuration
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// libs
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// methods
const createUser = require('../middlewares/createUser');
const { sendEmail } = require('../middlewares/email');
const { generateUser, deleteUser, activateUser } = require('../middlewares/users');
// models
const User = require('../models/user');
// files
const Email = fs.readFileSync(path.join(process.cwd(), 'assets', 'email.html'));

// routes (only email auth)
// // get
router.get('/', (req, res, next) => {
    res.render('sign', { darkMode: req.cookies.mode == "dark" });
});
router.get('/waitng', (req, res, next) => {
    res.render('sign/sent',
    { darkMode: req.cookies.mode == "dark" });
});
router.get('/auth/:token', async (req, res, next) => {
    var token = req.params.token;
    if (token) try {
        var decoded = jwt.verify(token, process.env.TOKEN_SEC, {
            maxAge: '480h',
        });
        if (req.cookies.email != decoded.email) throw Error();
        await User.findOne({ email: req.cookies.email})
            .then(v => {
                console.log([decoded.port, v.serialPort]);
                if ((!v)
                || decoded.port != v.serialPort) throw Error();
                res.cookie("sessionID", token, {
                    maxAge: 1000 * 60 * 60 * 24,
                    path: '/',
                });
                activateUser(decoded._id);
                res.clearCookie("email");
                res.redirect('/account');
        });
    } catch (err) {
        console.log(err);
        setTimeout(() => res.send("it's done wrongly"), 10000);
    }
    else {
        res.redirect('/not-found');
    }
});
// // post
router.post('/', (req, res, next) => {
    generateUser(req.body['email']).then(v => {
        var [{ email, _id, serialPort }, isNew] = v;
        var token = jwt.sign({ email, _id, port: serialPort}, process.env.TOKEN_SEC, {
            expiresIn: 100000,
        });
        var text = Email.toString().replace('{{link}}', token);
        sendEmail(
            req.body['email'],
            text,
            (e, i) => {
                if (e) {
                    isNew && deleteUser(_id);
                    res.send(e).status(404);
                    next(e);
                    return;
                }
                res.cookie("email", req.body['email'], {
                    maxAge: 1000000,
                    path: '/'
                }).redirect('/sign/waitng');
            }
        );
    });
});

// routes (classic auth)
// // get
/*router.get('/register', (req, res, next) => {
    var messege = req.query.mg;
    res.render('signing', { darkMode: true, index: 're', messege: messege });
});
router.get('/login', (req, res, next) => {
    var messege = req.query.mg;
    res.render('signing', { darkMode: true, index: 'lo', messege: messege });
});
// // post
router.post('/register', (req, res, next) => {
    if (createUser(req.body)) {
        res.redirect('./login');
    } else {
        res.redirect('./register?mg=خطأ+في+تسجيل+الدخول', 404);
    }
});
router.post('/login', (req, res, next) => {
    setTimeout(next, 7500);
});*/

// OOP Exporter
module.exports = router;