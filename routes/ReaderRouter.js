const router = require("express").Router();

const controller = require("../controllers/ReaderController")
const {checkTokenMiddleware} = require("../controllers/AuthController")

router.get("/all", controller.getAllBooks)
router.get("/search", controller.searchBooks)
router.get("/:bookID/:symbolsStart/:symbolsStop", controller.getPage)
router.put("/:bookID", checkTokenMiddleware, controller.getPage)

module.exports = router
