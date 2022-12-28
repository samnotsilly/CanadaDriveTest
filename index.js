const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const approuter = require("./router");
const app = express();

mongoose.connect(
  "mongodb+srv://sam:sam@cluster0.r7aa1.mongodb.net/Samdb?retryWrites=true&w=majority"
);

mongoose.connection.on("connected", () => {
  console.log("Application is connected to database");
});

app.use(
  session({
    secret: "nodemongodb",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("trust", 1);

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.set("view engine", "ejs");

app.use("/", approuter);

app.listen(3000, () => {
  console.log("Drive test server is working at port 3000");
});
