const { Schema, SchemaTypes, model } = require("mongoose");

module.exports = model('UserForDocs', new Schema({
    name: {
        type: String,
        required: false,
        minLength: 2,
        maxLength: 20,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    password: {
        type: String,
        required: false,
    },
    birth: {
        type: Date,
        required: false,
    },
    gender: {
        type: String,
        required: false,
        maxLength: 1,
        minLength: 1
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    serialPort: {
        type: Number,
        required: true,
    }
}));