const {Schema, model} = require("mongoose");

const User = new Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    password: {type: String, required: true},
    favorites: {type: [], required: false},
    isEmailConfirmed: {type: Boolean, required: true},
})

module.exports = model("User", User);
