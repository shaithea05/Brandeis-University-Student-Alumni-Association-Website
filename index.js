// imports the required imports
const express = require('express');
const mongoose = require("mongoose");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override")
const connectFlash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const passport = require("passport");
const socketio = require("socket.io");

const app = express();
// const router = express.Router();
const router = require("./routes/index");

// import models
const Event = require("./models/event");
const Job = require("./models/job");
const User = require("./models/user");

//imports controllers
const errorController = require('./controllers/errorController.js');
const eventsController = require("./controllers/eventsController.js");
const homeController = require('./controllers/homeController.js');
const jobsController = require("./controllers/jobsController.js");
const usersController = require("./controllers/usersController.js");
const chatController = require("./controllers/chatController");

// connects to db
mongoose.connect("mongodb://localhost:27017/brandeis_saa_express");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to the database!");
});

// sets localhost
app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser("secret_passcode"));
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  }));
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.set("token", process.env.TOKEN || "kitchenT0k3n");
app.get("token");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

app.use("/", router);


const server = app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

const io = require("socket.io")(server);
require("./controllers/chatController")(io);

// User.create({
//   name: "Shaithea",
//   email: "shaithea@brandeis.edu",
//   password: "shaithea",
//   role: "student",
//   graduationYear: 2024,
//   major: "Computer Science and Business",
//   zipCode: 02453,
//   isAdmin: true,
// })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// const server = app.listen(app.get("port"), () => {
//   console.log(`Server running at http://localhost:${app.get("port")}`);
// });

// const io = socketio(server);
// chatController(io);
