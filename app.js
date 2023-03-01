// local dependencies
const express = require("express")

// routers
const AuthRouter = require("./routes/AuthRouter")
const MainRouter = require("./routes/MainRouter")
const ProfileRouter = require("./routes/ProfileRouter")

const app = express()

app.use("/auth", AuthRouter)
app.use("/auth", MainRouter)
app.use("/auth", ProfileRouter)

app.listen(8080, (error) => {
    if (error) {
        console.error(error);
    } else {
        console.log("server has been started successfully")
    }
})
