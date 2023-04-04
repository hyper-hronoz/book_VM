const router = require("express").Router();

const controller = require("../controllers/ReaderController")

router.get("/all", controller.getBooksNames)
router.get("/:bookID/:symbolsStart/:symbolsStop", controller.getPage)

module.exports = router
