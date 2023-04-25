const { Iconv } = require("iconv");
const HronozStream = require("../utils/build/Release/HronozStream");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const User = require("../models/User");
const {Mongoose, ObjectId} = require("mongoose");
const fs = require("fs");
const path = require("path");

class ReaderController {
    constructor() {
        if (ReaderController._instance) {
            return ReaderController._instance;
        }
        ReaderController._instance = this;
    }

    async addToFavorites(req, res) {
        const bookID = req.params.bookID;

        const token = req.headers.authorization.split(" ")[1];
        const userID = jwt.verify(token, process.env["book_VM_secret"]).id;

        const book = await Book.findOne({
            _id: bookID,
        });

        if (!book) {
            return res.status(400).send("Not book founded");
        }

        await User.updateOne(
            {
                _id: userID,
            },
            { $addToSet: { favorites: bookID } }
        );
        return res.status(200).send("Book has been added to favorites");
    }

    async searchBooks(req, res) {
        console.log("Searching books");
        const expression = req.params["expression"];
        if (!expression) {
            return res.status(400).send("Wrong request");
        }
        console.log(expression)
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
        // save borrowed symbols
        let bookID = req.params.bookID;
        let page = req.params.page;
        let maxSymbols = req.params.symbols;

        console.log(bookID, page, maxSymbols)

        const targetBook = await Book.findById(bookID);

        if (!targetBook) {
            return res.status(404).send("This book does not exists or was deleted");
        }
        console.log(targetBook.bookPath)

        const text = HronozStream.read(
            targetBook.bookPath,
            Number(page),
            Number(maxSymbols),
        );

        return res.status(200).send(text);
    }
}


module.exports = new ReaderController();

