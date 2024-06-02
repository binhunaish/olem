// models
const field = require("../models/field");
const list = require("../models/list");
const lesson = require("../models/lesson");
// types
const { Types } = require("mongoose");

// definding the schema of the result
var schema = {
    id: '',
    founded: false,
    suggested: [],
    root: []
};

// fetching lessons method
const fetchLesson = (id) => {
    return new Promise(async (res, rej) => {
        await lesson.findById(id)
        .select({title: 1, _id: 1})
        .then(v => v._doc)
        .then(v => res(v))
        .catch(err => rej(err));
    });
};
// fetching lists method
const fetchList = (content) => {
    var result = [];
    return new Promise((res, rej) => {
        // fetching the content
        var count = 0;
        var checkFinishing = () => {
            if (count == content.length) res(result);
        }
        content.forEach(async (v, i) => {
            if (v.type == "Le") /* if it was lesson */ {
                await fetchLesson(v.id)
                .then(v => {
                    count++;
                    result[i] =  {
                        type: 'Le',
                        ...v
                    };
                    checkFinishing();
                });
            } else if (v.type == "Li") /* if it was list */ {
                await list.findById(v.id)
                .then(v => fetchList(v.content).then(e => {
                    count++;
                    result[i] = {
                        type: 'Li',
                        content: e,
                        title: v.title
                    };
                    checkFinishing();
                }));
            }
        });
        
    });
}

// exporting fetcher method
module.exports = async (id) => {
    schema.founded = false;
    var promises = [];
    return new Promise(async (res, rej) => {
        // getting title, root, id and founded props
        if (Types.ObjectId.isValid(id)) {
            var p1 = await field.findById(id)
            .then(async v => {
                // getting founded
                schema.founded = Boolean(v);
                //getting title
                schema.title = v.title;
                // getting id
                schema.id = id;
                // getting root
                if (v.content.length) {
                    var p2 = await fetchList(v.content)
                    .then(v => {
                        if (v) schema.root = v;
                        else schema.root = [];
                    });
                    promises.push(p2);
                } else {
                    schema.root = [];
                }
            });
            promises.push(p1);
        }
        // getting suggestion fields
        var p2 = await field.find({})
        .select({title: 1})
        .then(v => schema.suggested = v);
        promises.push(p2);
        // finish all
        Promise.all(promises).then(() => {
            res(schema);
        });
    });
};