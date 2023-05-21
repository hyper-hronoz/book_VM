const iconv = require("iconv");
const HronozStream = require("../utils/build/Release/HronozStream");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const User = require("../models/User");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { Console } = require("console");

class ReaderController {
  constructor() {
    if (ReaderController._instance) {
      return ReaderController._instance;
    }
    ReaderController._instance = this;
  }

  getToken = (req) => {
    return req.headers.authorization.split(" ")[1];
  };

  getUserId = (req) => {
    return jwt.verify(this.getToken(req), process.env["book_VM_secret"]).id;
  };

  async getFavBooks(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const currentUserId = jwt.verify(token, process.env["book_VM_secret"]).id;
      console.log(currentUserId);

      const user = await User.findById(currentUserId);

      if (!user) {
        res.status(400).send("Нет такого пользователя");
      }

      const books = await Book.find({ _id: { $in: user.favorites } });

      if (!books || books.length == 0) {
        return res.status(404).send({ error: "NO fav books found" });
      }

      return res.status(200).send(books);
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal server error");
    }
  }

  removeFromFavorites = async (req, res) => {
    try {
      const bookID = req.params.bookID;

      const userID = this.getUserId(req);

      console.log(bookID, userID);

      // const user = await User.findById(userID);
      const user = await User.findOne({
        _id: new mongoose.mongo.ObjectId(userID),
      });

      console.log(user);

      if (!user) {
        return res.status(400).send({ msg: "Юзера нет" });
      }

      const result = await User.updateOne(
        { _id: new mongoose.mongo.ObjectId(userID) },
        { $pull: { favorites: bookID } }
      );

      if (result.modifiedCount == 0) {
        return res.status(409).send({ msg: "Bad requiest" });
      }

      return res.status(200).send({ msg: "Удалено успешно" });
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal server error");
    }
  };

  async addToFavorites(req, res) {
    try {
      const bookID = req.params.bookID;

      const token = req.headers.authorization.split(" ")[1];
      const userID = jwt.verify(token, process.env["book_VM_secret"]).id;

      const book = await Book.findOne({
        _id: bookID,
      });

      if (!book) {
        return res.status(400).send("Not book founded");
      }

      const result = await User.updateOne(
        {
          _id: userID,
        },
        { $addToSet: { favorites: bookID } }
      );

      if (result.modifiedCount == 0) {
        return res.status(400).send({ msg: "bad request" });
      }

      return res.status(200).send({ msg: "Book has been added to favorites" });
    } catch (e) {
      console.error(e);
    }
  }

  async searchBooks(req, res) {
    console.log("Searching books");
    const expression = req.params["expression"];
    if (!expression) {
      return res.status(400).send("Wrong request");
    }
    console.log(expression);
    return res.status(200).send(
      await Book.find({
        $or: [
          { title: { $regex: expression, $options: "i" } },
          { author: { $regex: expression, $options: "i" } },
        ],
      })
    );
  }

  async getBooks(req, res) {
    const { skip, limit } = req.body;
    return res.status(200).send(Book.find().skip(skip).limit(limit));
  }

  async getAllBooks(req, res) {
    const books = await Book.find();
    return res.status(200).send(books);
  }

  async getPage(req, res) {
    try {
      console.log("Getting page");
      // save borrowed symbols
      let bookID = req.params.bookID;
      let page = req.params.page;
      let maxSymbols = req.params.symbols;

      console.log(bookID, page, maxSymbols);

      const targetBook = await Book.findById(bookID);

      if (!targetBook) {
        return res.status(404).send("This book does not exists or was deleted");
      }
      console.log(targetBook.bookPath);

      let text = HronozStream.read(
        Number(maxSymbols),
        Number(page),
        targetBook.bookPath
      );

      let pages = text.split(" ")[0];
      text = text.substr(text.indexOf(" ") + 1);

      return res.status(200).send({ pages: Number(pages), text: text });
    } catch (e) { 
      console.error(e)
      return res.status(500).send("Internal server error")
    }
  }
}

module.exports = new ReaderController();
