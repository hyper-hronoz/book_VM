const router = require("express").Router();

const controller = require("../controllers/MainController")

router.get("/", controller.main)

module.exports = router
