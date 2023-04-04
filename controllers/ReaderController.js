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

    async getBooksByQuery(req, res) {
        const book = await Book.findOne();
    }

    async searchBooks(req, res) {
        console.log("Searching books")
        const {
            query,
        } = req.body;
        console.log(query)
        await Book.createIndex({"subtitle":"text","description":"text"})
        const founded = await Book.find({ $text: { $search: "The" } })
        console.log(founded)
        return res.status(200).send();
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
