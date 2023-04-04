// local dependencies
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

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

app.use("/", MainRouter);
app.use("/auth", AuthRouter);
app.use("/profile", ProfileRouter);
app.use("/books", ReaderController);
app.use("/admin", AdminRouter);

app.listen(8080, async (error) => {
  await mongoose.connect("mongodb://127.0.0.1:27017/books").catch(e => console.e(e));
  if (error) {
    console.error(error);
  } else {
    console.log("server has been started successfully");
  }
});
