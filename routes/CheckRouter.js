const router = require("express").Router();

const controller = require("../controllers/AuthController")

router.post("/", controller.checkTokenMiddleware, (req, res) => {
  return res.status(200).send("Norm");
})

module.exports = router
