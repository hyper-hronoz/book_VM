const path = require("path");
const Book = require("../models/Book");
const fs = require("fs");

class AdminController {

  constructor() {
    if (!this._instance) {
      this._instance = this;
    }
    return this._instance;
  }

  async addBook(req, res) {
    const {
      title,
      author,
      imageLink,
      bookPath,
    } = req.body;

    const book = await Book.findOne({
      title,
      author,
      imageLink,
      bookPath,
    });

    if (book) {
      return res.status(303).send("The record is already exists");
    }

    const newBook = new Book({
      title,
      author,
      imageLink,
      bookPath,
    });

    await newBook.save();

    return res.status(200).send("Success")
  }

  removeBook() {
  }
}

module.exports = new AdminController();
