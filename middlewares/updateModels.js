// methods
const { deleteFile, deleteFolder } = require('./deleteModels');
const { saveFile, saveFolder } = require('./saveModels');
// models
const Lesson = require('../models/lesson');
const List = require('../models/list');
const Field = require('../models/field');

// lesson
const updateLesson = async (id, { title, f1}, file, cb) => {
    var obj = {
        title: title,
        content: undefined
    };
    await Lesson.findOneAndUpdate({_id: id}, {...obj, content: file?saveFolder(file): undefined }, { runValidators: true, returnOriginal: true }).then(v => {
        if (f1 != 404) deleteFolder(v.content);
        cb();
    }).catch(err => {
        if (f1 != 404) deleteFolder(obj.content);
        console.log(obj);
        console.log(err);
    });
}

// list
const updateList = async (id, { title, f1}, file, cb) => {
    var obj = {
        title: title,
        icon: undefined
    };
    await List.findOneAndUpdate({_id: id}, {...obj, icon: file?saveFile(file[0]): undefined }, { runValidators: true, returnOriginal: true }).then(v => {
        if (f1 != 404) deleteFile(v.icon);
        cb();
    }).catch(err => {
        if (f1 != 404) deleteFile(obj.icon);
        console.log(obj);
        console.log(err);
    });
}

// feild
const updateFeild = async (id, { title, type, description, f1}, file, cb) => {
    var obj = {
        title: title,
        type: type,
        description: description,
        icon: undefined
    };
    await Field.findOneAndUpdate({_id: id}, {...obj, icon: file?saveFile(file[0]): undefined }, { runValidators: true, returnOriginal: true }).then(v => {
        if (f1 != 404) deleteFile(v.icon);
        cb();
    }).catch(err => {
        if (f1 != 404) deleteFile(obj.icon);
        console.log(obj);
        console.log(err);
    });
}

// OOP Exporter
module.exports = {
    updateFeild,
    updateLesson,
    updateList
};