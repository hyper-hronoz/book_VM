const router = require("express").Router();

const controller = require("../controllers/ReaderController")
const {checkTokenMiddleware} = require("../controllers/AuthController")

router.get("/", checkTokenMiddleware, controller.getFavBooks)
router.delete("/:bookID", checkTokenMiddleware, controller.removeFromFavorites)
router.put("/:bookID", checkTokenMiddleware, controller.addToFavorites)

module.exports = router
