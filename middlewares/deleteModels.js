// libs
const fs = require('fs');
// models
const Lesson = require('../models/lesson');
const List = require('../models/list');
const Field = require('../models/field');

// lessons
const deleteLesson = async id => {
    await Lesson.findByIdAndDelete(id).then(v => {
        if (v.content) deleteFolder(v.content);
    });
}

// delete
const deleteList = async id => {
    await List.findByIdAndDelete(id).then(v => {
        if (v.icon) deleteFile(v.icon);
    });
}

// feild
const deleteField = async id => {
    await Field.findByIdAndDelete(id).then(v => {
        if (v.icon) deleteFile(v.icon);
        console.log(`${v} is deleted`);
    });
}

// file
const deleteFile = (file) => {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    } else {
        console.log('this file already deleted')
    }
}

// folder
const deleteFolder = (folder) => {
    fs.rmSync(folder, {recursive: true, focus: true});
}

// OOP Exporter
module.exports = {
    deleteLesson,
    deleteList,
    deleteField,
    deleteFile,
    deleteFolder
}