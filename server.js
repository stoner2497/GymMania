const express = require("express");
const exhb = require("express-handlebars");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
//const flash = require('connect-flash');
const passport = require("passport");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

//requiring routes
const admin = require("./routes/admin");
//const user = require("./routes/user");

//
mongoose.Promise = global.Promise;
//connect to mongoose

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const port = process.env.PORT || 4000;

//path
// static path for CSS, Images and JS
app.use("/public", express.static(path.join(__dirname, "/public")));
//passport config

//require("./config/passport")(passport);

//setting middleware
app.engine(
  "handlebars",
  exhb({
    defaultLayout: "main"
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

//Express ssions midleware
app.use(
  session({
    secret: "Stonned",
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//flash middleware

//index route

//using routes
app.use("/admin", admin);
//app.use("/user", user);

app.listen(port, () => {
  console.log(`the server is runing on this ${port} shit...!!!`);
});
