if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
} const express = require('express');
const router = express.Router();
const Lesson = require('../models/lesson');
const List = require('../models/list');
const Field = require('../models/field');
const formidable = require('formidable');
const { saveFeild, saveList, saveLesson } = require('../middlewares/saveModels');
const { deleteField, deleteLesson, deleteList } = require('../middlewares/deleteModels');
const { updateFeild, updateList, updateLesson } = require('../middlewares/updateModels');

// model map
const modelMap = new Map([["Le", Lesson],["Li", List],["Fe", Field]]);

router.use((req, res, next) => {
    if (!req.user)
        res.redirect('/not-found');
    else if (req.user.email != process.env.ADMIN_EMAIL)
        res.redirect('/not-found');
    else next();
});

// Pages
router.get('/', (req, res) => {
    res.render('admin/index');
});
router.get('/edit', (req, res) => {
    res.render('admin/edit');
});

// edit table
router.get('/getTableData', async (req, res, next) => {
    var Model = modelMap.get(req.query.type);
    var path = Model.schema.paths;
    if (req.query.update) {
        await Model.findById(req.query.update)
        .then( async v =>{
            res.send(v);
        });
    } else {
        await Model.find({}).then( v =>{
            res.json({path: path, values: v});
        });
    }
});

// form
router.post('/form', async (req, res, next) => {
    var conditional = req.query.type == 2;
    const form = formidable.formidable({createDirsFromUploads: conditional, module: conditional});
    form.parse(req, (err, fields, files) => {
        if (err) console.error(err);
        Object.keys(fields).forEach(v => {
            fields[v] = fields[v].join();
        });
        var f = null;
        var {title, type, description} = fields;
        if (Number(fields['indexOfType']) == 0) f = saveFeild;
        else if (Number(fields['indexOfType']) == 1) f = saveList;
        else if (Number(fields['indexOfType']) == 2) f = saveLesson;
        else {res.send('there is notype').status(404); next()}
        if (f != null) f(() => {
            res.send("creating is done!");
        }, {title, type, description}, files.f1);
    });
});
router.put('/form', (req, res, next) => {
    var conditional = req.query.type == 2;
    const form = formidable.formidable({createDirsFromUploads: conditional, module: conditional});
    form.parse(req, async (err, fields, files) => {
        if (err) console.error(err);
        Object.keys(fields).forEach(v => {
            fields[v] = fields[v].join();
        });
        var F = () => 0;
        if (Number(fields['indexOfType']) == 0) F = updateFeild;
        else if (Number(fields['indexOfType']) == 1) F = updateList;
        else if (Number(fields['indexOfType']) == 2) F = updateLesson;
        else {res.send('there is notype').status(404); next()}
        F(fields.id, fields, files.f1, () => {
            res.send('updating done');
        });
    });
}); 
router.delete('/form', async (req, res, next) => {
    switch (req.query.type) {
        case "Fe":
            deleteField(req.query.id);
            res.send('deleting is done');
            break;
        case "Le":
            deleteLesson(req.query.id);
            res.send('deleting is done');
            break;
        case "Li":
            deleteList(req.query.id);
            res.send('deleting is done');
            break;
        default:
            res.send(`there is no type`).status(404);
            break;
    }
});

// resorting
router.put('/addarray', async (req, res, next) => {
    var result = [];
    var count = 0;

    await List.find({})
    .then(v => v.map(v => v._doc))
    .then(v => v.filter(v => v._id != req.body.id))
    .then(v => result.push({type: "Li", values: v}))
    .finally(() => {
        count++;
        if (count == 2) res.json(result);
    });

    await Lesson.find({})
    .then(v => {
        v.map(v => v._doc);
        result.push({type: "Le", values: v});
        return v.map(v => v._doc);
    })
    .finally(() => {
        count++;
        if (count == 2) res.json(result);
    })
});
router.put('/fetchupdatearray', async (req, res, next) => {
    var array = req.body.array;
    var result = [];
    var count = 0;
    array.forEach(async (e, i) => {
        var Model = modelMap.get(e['type']);
        await Model.findById(e["id"].toString()).select({_id: 1, title: 1, icon: 1}).then(v => {
            if (v != null) {
                v = {...v._doc, Ctype: e['type']}
                result[i] = v;
            }
            count++;
        }).finally(() => {
            if (count == array.length) res.send(result.filter(v => v != null));
        }).catch(e => console.error(e));
    });
});
router.put('/updatearray', async (req, res, next) => {
    var Model = modelMap.get(req.body.type);
    if (req.body.type == 'Li') req.body.result = req.body.result.filter(v => v.id != req.body.id);
    await Model.findByIdAndUpdate(req.body.id, {content: req.body.result}, {runValidators: true, new: true}).then(v => {
        res.sendStatus(200);
    })
});

// OOP Exporter
module.exports = router;