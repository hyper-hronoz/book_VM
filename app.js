// local dependencies
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

const AuthRouter = require("./routes/AuthRouter")
const MainRouter = require("./routes/MainRouter")
const ProfileRouter = require("./routes/ProfileRouter")
const ReaderController = require("./routes/ReaderRouter")

app.use("/", MainRouter)
app.use("/auth", AuthRouter)
app.use("/profile", ProfileRouter)
app.use("/reader", ReaderController)

app.listen(8080, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log("server has been started successfully")
    }
})
