const router = require("express").Router();

const controller = require("../controllers/ReaderController")

router.get("/all", controller.getAllBooks)
router.get("/search", controller.searchBooks)
router.get("/:bookID/:symbolsStart/:symbolsStop", controller.getPage)

module.exports = router
