const router = require("express").Router();

const controller = require("../controllers/ProfileController")

router.get("/", controller.stumb)

module.exports = router
