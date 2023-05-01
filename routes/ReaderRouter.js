const router = require("express").Router();

const controller = require("../controllers/ReaderController")

router.use("/fav", require("./FavBooksRouter"))

router.get("/all", controller.getAllBooks)
router.get("/search/:expression", controller.searchBooks)
router.get("/:bookID/:page/:symbols", controller.getPage)

module.exports = router
