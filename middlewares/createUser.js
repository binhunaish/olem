// libs
const bcrypt = require('bcrypt');
// models
const user = require("../models/user");

// functions
function validateParams({ name, email, password, birth, gender }) {
    return (typeof name == 'string'
    && name.length >= 2
    && typeof email == 'string'
    && email.includes('@')
    && email.length > 2
    && password.length > 7
    && !isNaN(Date.parse(birth))
    && gender == "M" || gender == "F"
    );
}

// export the main method
module.exports = async ({ name, email, password, birth, gender }) => {
    birth = new Date(birth);
    if (!validateParams({ name, email, password, birth, gender })) return false;
    var account = new user({ name, email, password, birth, gender });
    try {
        account.validateSync();
    } catch (error) {
        console.log(error);
        return false;
    }
    account.password = bcrypt.hashSync(password, 10);
    await account.save().then((v) => {
        return true;
    });
}
