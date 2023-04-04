const router = require("express").Router();

const controller = require("../controllers/AdminController")

router.post("/addbook", controller.addBook)

module.exports = router
