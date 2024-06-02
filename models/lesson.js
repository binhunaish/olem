const { Schema, SchemaTypes, model } = require("mongoose");

module.exports = model('LessonssForDocs', new Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
    },
    comments: [{
        type: SchemaTypes.ObjectId,
        required: true
    }]
}));