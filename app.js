// lib
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
// methods
const configureEnv = require('dotenv').config;
const cookieParser = require('cookie-parser');
const { verifyToken } = require('./middlewares/jwt');
const app = express();
// routes
const admin = require('./routers/admin');
const docPage = require('./routers/docPage');
const sign = require('./routers/sign');
const field = require('./models/field');
// values
const mongLink = process.env.DB_LINKSL;

// app setting
app.set("view engine", "ejs");
configureEnv();

// app using
app.use(express.json());
// app.use(express.static("public"));
app.use(express.urlencoded());
app.use(cookieParser());


// vercel settings
app.use(express.static(__dirname + "public"));
app.set("views",__dirname + "/views");


// mongoDB connection
mongoose.connect(mongLink, {
    dbName: "docs",
}).then((v) => {
    console.log("connection done!");
}).catch((e) => {
    console.log(e);
    throw Error("db doesn't work");
});

// routers
app.use('/admin', verifyToken , admin);
app.use('/feild', docPage);
app.use('/sign', sign);

// routes
app.get('/', verifyToken, async (req, res, next) => {
    var fields = 0;
    await field.find({}).select({title: 1, description: 1}).then(v => v.map(v => v._doc))
    .then(v => fields = v)
    .then(v =>{
        res.status(200).render('open', { darkMode: req.cookies.mode == "dark", isSigned: Boolean(req.user), fields});
    })
});
app.get('/about', (req, res, next) => {
    res.status(200).render('about',
        { darkMode: req.cookies.mode == "dark" });
});
app.get('/not-found', (req, res, next) => {
    res.status(404).render('unreadable');
});
app.get('/account', verifyToken, (req, res, next) => {
    if (!req.user) {
        res.redirect('/sign');
        return;
    }
    res.render('account',
    { darkMode: req.cookies.mode == "dark" })
});

// 404 page
app.use((req, res) => {
    res.redirect('/not-found');
});

module.exports = app;