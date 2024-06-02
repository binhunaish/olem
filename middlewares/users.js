// models
const user = require("../models/user")

// genrate
const generateUser = async (email) => {
    return new Promise(async (res, rej) => {
        await user.findOne({ email }).then(async v => {
            isNew = !v;
            var randomCode = Number.parseInt(1000000 * Math.random());
            if (!v) {
                var u = new user({ email, serialPort: randomCode });
                u.validateSync();
                u.save().then(v => res([v, isNew]))
                    .catch(err => rej(err));
            } else {
                v.serialPort = randomCode;
                await v.save();
                res([v, isNew]);
            }
        }).catch(err => rej(err));
    })
}

// delete
const deleteUser = async (_id) => {
    await user.findByIdAndDelete(_id);
}

// activate
const activateUser = async (_id) => {
    await user.findByIdAndUpdate(_id, {isVerified: true});
}

// OOP Exporter
module.exports = {
    generateUser,
    deleteUser,
    activateUser
}