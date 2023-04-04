const path = require("path");
const Book = require("../models/Book");
const fs = require("fs");
const { log } = require("console");

class ReaderController {
    constructor() {
        if (ReaderController._instance) {
            return ReaderController._instance;
        }
        ReaderController._instance = this;
    }

    async searchBooks(req, res) {
        console.log("Searching books")
        const {
            query,
        } = req.body;
        return res.status(200).send(await Book.find({ $or: [{title: {$regex: query,$options: 'i' }}, {author: {$regex: query, $options: 'i' }}]}));
    }

    async getBooks(req, res) {
        const {
            skip,
            limit,
        } = req.body;
        return res.status(200).send(Book.find().skip(skip).limit(limit));
    }

    async getAllBooks(req, res) {
        const books = await Book.find();
        return res.status(200).send(books);
    }

    getPage(req, res) {
        // save borrowed symbols
        let symbolsStart = req.params.symbolsStart;
        let symbolsStop = req.params.symbolsStop;
        let symbolsAmount = req.params.symbolsStop - req.params.symbolsStart;
        let bookID = req.params.bookID;

        const fileNames = fs.readdirSync("/home/hronoz/book_VM/books");

        fileNames.forEach((item) => {
            if (item === bookID + ".txt") {
                res.status(200).send();
            }
        });

        res.status(404).send("This book does not exists or was deleted");
    }
}

module.exports = new ReaderController();
