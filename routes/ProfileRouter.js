const router = require("express").Router();

const controller = require("../controllers/AuthController")

router.get("/favorites", controller.main)

module.exports = router
