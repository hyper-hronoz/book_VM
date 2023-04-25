// local dependencies
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

const allowedOrigins = ['www.example1.com',
                      'www.example2.com'];
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://192.168.0.102:8080");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use("/static", express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

const AuthRouter = require("./routes/AuthRouter");
const MainRouter = require("./routes/MainRouter");
const ProfileRouter = require("./routes/ProfileRouter");
const ReaderController = require("./routes/ReaderRouter");
const AdminRouter = require("./routes/AdminRouter");
const Checker = require("./routes/CheckRouter");

app.use("/", MainRouter);
app.use("/auth", AuthRouter);
app.use("/profile", ProfileRouter);
app.use("/books", ReaderController);
app.use("/admin", AdminRouter);
app.use("/check", Checker)

app.listen(8080, "192.168.0.101",  async (error) => {
  await mongoose.connect("mongodb://127.0.0.1:27017/books").catch(e => console.error(e));
  if (error) {
    console.error(error);
  } else {
    console.log("server has been started successfully");
  }
});
