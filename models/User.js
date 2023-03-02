
const Model = require("../models/Model");

class User extends Model {
    constructor(...args) {
        super();
        console.log(args)
    }
}

module.exports = User
