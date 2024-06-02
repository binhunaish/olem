const { Schema, SchemaTypes, model } = require("mongoose");

module.exports = model('ListsForDocs', new Schema({
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
    content: {
        type: [Object],
        required: true,
        validate: {
            validator: v => {
                this.validate
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