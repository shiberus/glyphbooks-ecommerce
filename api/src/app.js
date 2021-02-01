const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const passport = require("./passport");
session = require("express-session");
var flash = require("connect-flash");

require("./db.js");

const server = express();

server.name = "API";

server.use(flash());
server.use(passport.initialize());
server.use(passport.session());
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));
server.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.all("*", function (req, res, next) {
  passport.authenticate("bearer", function (err, user) {
    if (err) return next(err);
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
});

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

// server.use((req, _res, next) => {
//   console.log("pre-test");
//   passport.authorize("bearer", function (_err, user) {
//     console.log("test");
//     if (user) req.user = user;
//     next();
//   });
// });

server.use("/", routes);

module.exports = server;
