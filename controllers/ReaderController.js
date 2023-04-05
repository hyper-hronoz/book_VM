const path = require("path");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const User = require("../models/User");
const mongoose = require("mongoose");
const fs = require("fs");
const { log } = require("console");

const ObjectId = mongoose.Types.ObjectId;

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
        const { query } = req.body;
        return res.status(200).send(
            await Book.find({
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { author: { $regex: query, $options: "i" } },
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
        let symbolsStart = req.params.symbolsStart;
        let symbolsStop = req.params.symbolsStop;
        let symbolsAmount = req.params.symbolsStop - req.params.symbolsStart;
        let bookID = req.params.bookID;

        const books = fs.readdirSync("../books");

        const targetBook = await books.findOne({ bookID });

        if (!targetBook) {
            return res.status(404).send("This book does not exists or was deleted");
        }

        const file = fs.readFile(targetBook.title, "utf8", (error) => {
            console.error(error);
        });

        if (!file) {
            return res.status(409).send("File was not found internal server error");
        }
    }
}

const calculate = require('../utils/build/Release/HronozStream');
console.log(calculate.read());

module.exports = new ReaderController();
