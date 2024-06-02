// libs
const fs = require('fs');
const express = require('express');
const router = express.Router();
// methods
const fetchFeild = require('../middlewares/fetchFeild');
// models
const lesson = require('../models/lesson');
const converter = require('../converters/docsConvert');
const field = require('../models/field');
const { verifyToken } = require('../middlewares/jwt');

// routes
router.get('/', (req, res, next) => {
    field.find({}).select({title: 1, description: 1, type: 1})
    .then(v => {
        res.status(200).render('feilds', {feilds: v, darkMode: req.cookies.mode == "dark"});
    })
});
router.get('/:id', async (req, res, next) => {
    var id = req.params.id;
    fetchFeild(id).then(v => {
        if (!v.founded) {
            next();
            return;
        }
        v.darkMode = req.cookies.mode == "dark";
        res.render('read', v);
    }).catch(err => next());
});
router.get('/lesson', async (req, res, next) => {
    var id = req.query.id;
    if (!id) next();
    var p1 = await lesson.findById(id).select({title: 1, content: 1, createdAt: 1}).then(v => {
        var content = "";
        var status = 200;
        var foldername = "";
        if (fs.existsSync(v.content)) {
            foldername = v.content;
            content = fs.readFileSync("./" + v.content + '/readme.md').toString();
            content = converter.makeHtml(content);
        } else {
            content = "this lesson is missed";
            status = 500;
        }
        var result = {
            title: v.title,
            content: content,
            date: v.createdAt,
            foldername: foldername.substring(8)
        };
        res.send(result).status(status);
    }).catch(err => log(err));
});
router.get('/not-found', (req, res, next) => {
    res.render('unreadable')
});

// 404 error
router.use((req, res, next) => {
    res.redirect('./not-found');
})

// OOP Exporter
module.exports = router;