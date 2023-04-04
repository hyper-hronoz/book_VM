const path = require("path");
const fs = require("fs");
const { log } = require("console");

class ReaderController {
  constructor() {
    if (ReaderController._instance) {
      return ReaderController._instance;
    }
    ReaderController._instance = this;
  }

  getBooksNames(req, res) {
    const fileNames = fs.readdirSync("/home/hronoz/book_VM/books");
    const result = [];
    fileNames.forEach((item) => {
      let ext = path.extname(item || "").split(".");
      ext = ext[ext.length - 1];
      if (ext == "txt") {
        result.push(item);
      }
    });
    res.send(result);
  }

  getPage(req, res) {
    // save borrowed symbols
    let symbolsStart = req.params.symbolsStart;
    let symbolsStop = req.params.symbolsStop;
    let symbolsAmount = req.params.symbolsStop - req.params.symbolsStart;
    let bookID = req.params.bookID;

    const fileNames = fs.readdirSync("/home/hronoz/book_VM/books"); 


    fileNames.forEach(item => {
      if (item === bookID + ".txt") {

        res.status(200).send();
      } 
    })

    res.status(404).send("This book does not exists or was deleted")
  }
}

module.exports = new ReaderController();
