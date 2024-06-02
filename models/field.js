const { Schema, SchemaTypes, model } = require("mongoose");


module.exports = model('FieldsForDocs', new Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
        unique: true
    },
    icon: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 10000
    },
    content: {
        type: [Object],
        required: true,
        validate: {
            validator: v => {
                var callback = (v) => {
                    if (typeof v == 'object' && v.id && v.type && Object.keys(v).length == 2) 
                    return v; 
                    else throw new Error;
                };
                return v.map(callback);
            },
            message: "the content is not completed"
        }
    },
}));