const router = require("express").Router();

const controller = require("../controllers/AuthController")

router.post("/signup", controller.registration)
router.post("/login", controller.login)
router.post("/confirm", controller.sendConfirmationEmail)
router.get("/confirm/:token", controller.confirmEmail)

module.exports = router
