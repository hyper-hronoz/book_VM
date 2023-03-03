const Schema = require("./Schema");
const Model = require("./Model");

const UserSchema = new Schema({
    id: {type: String, unique: true, required: true},
    email: { type: String, unique: true, lowercase: true, required: true },
    password: {type: String, required: true},
    isEmailConfirmed: {type: Boolean, required: true},
})

class User extends Model {
    constructor(fuilds) {
        super(fuilds, UserSchema)
    }
}

module.exports = User;
