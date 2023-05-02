// local dependencies
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://192.168.71.211:8080");
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

app.use("/", require("./routes/MainRouter"));
app.use("/auth", require("./routes/AuthRouter"));
app.use("/profile", require("./routes/ProfileRouter"));
app.use("/books", require("./routes/ReaderRouter"));
app.use("/admin", require("./routes/AdminRouter"));
app.use("/check", require("./routes/CheckRouter"))

app.listen(8080,  async (error) => {
  await mongoose.connect("mongodb://127.0.0.1:27017/books").catch(e => console.error(e));
  if (error) {
    console.error(error);
  } else {
    console.log("server has been started successfully");
  }
});
