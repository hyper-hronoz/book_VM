const {Schema, model} = require("mongoose");

const Book = new Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    imageLink: {type: String, required: false},
    bookPath: {type: String, required: true},
})

module.exports = model("Book", Book);
