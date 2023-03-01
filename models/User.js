
const Model = require("../models/Model");

class User extends Model {
    constructor(email, password) {
        super();
        this.email = email
        this.password = password
    }
}
