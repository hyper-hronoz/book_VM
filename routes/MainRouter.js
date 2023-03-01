const router = require("express").Router();

const controller = require("../controllers/AuthController")

router.get("/", controller.main)
router.get("/books", controller.main)

module.exports = router
