// libs
const fs = require('fs')
// methods
const { deleteFile } = require('./deleteModels');
// models
const Lesson = require('../models/lesson');
const List = require('../models/list');
const Field = require('../models/field');

// lesson
const saveLesson = async (cb, {title}, file) => {
    var obj = {
        title: title,
        content: saveFolder(file),
        comments: []
    };
    var lesson = new Lesson(obj);
    lesson.validateSync();
    await lesson.save().then(() => {
        console.log('saving done');
        cb();
    }).catch(err => {
        deleteFile(obj.content);
    });
};

// list
const saveList = async (cb, {title}, file, content) => {
    var obj = {
        title: title,
        icon: saveFile(file[0]),
        content: content
    };
    console.log(obj)
    var list = new List(obj);
    list.validateSync();
    await list.save().then(() => {
        console.log('saving done');
        cb();
    }).catch(err => {
        console.log(err)
        deleteFile(obj.icon);
    });
};

// feild
const saveFeild = async (cb, {title, type, description}, file, content) => {
    var obj = {
        title: title,
        icon: saveFile(file[0]),
        type: type,
        description: description,
        content: content
    };
    var field = new Field(obj);
    field.validateSync();
    await field.save().then(() => {
        console.log('saving done');
        cb();
    }).catch(err => {
        deleteFile(obj.icon);
        console.error(err)
    });
};

// file
const saveFile = (file) => {
    var type = file.originalFilename.split('.').pop();
    var folder = `public/${type}`;
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);
    var path = `${folder}/_${Date.now().toString()}.${type}`;
    var oldPath = file.filepath;
    fs.renameSync(oldPath, path);
    return path;
};

// folder
const saveFolder = (folderfiles) => {
    var dirName = './public/lessos/' + Date.now().toString();
    fs.mkdirSync(dirName);
    folderfiles.forEach(e => {
        if (e.originalFilename.split('/').length == 2 && e.originalFilename.split('/')[1] == "readme.md")
        fs.renameSync(e.filepath, dirName + '/readme.md')
        if (e.originalFilename.split('/').length > 2 && e.originalFilename.split('/')[1] == "imgs")
            if (e.originalFilename.split('/').length == 3){
                if (!fs.existsSync(dirName + '/imgs')) fs.mkdirSync(dirName + '/imgs');
                fs.renameSync(e.filepath, dirName + '/imgs/' + e.originalFilename.split('/')[e.originalFilename.split('/').length - 1]);
            }
    });
    return dirName;
};

// OOP Exporter
module.exports = {
    saveLesson,
    saveList,
    saveFeild,
    saveFile,
    saveFolder
};