const router = require("express").Router();

const controller = require("../controllers/ReaderController")
const {checkTokenMiddleware} = require("../controllers/AuthController")

router.get("/all", controller.getAllBooks)
router.get("/search/:expression", controller.searchBooks)
router.get("/:bookID/:page/:symbols", controller.getPage)
router.put("/:bookID", checkTokenMiddleware, controller.addToFavorites)

module.exports = router
