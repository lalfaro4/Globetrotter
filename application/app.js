var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var handlebars = require('express-handlebars');
var session = require('express-session');
var database = require('./private/js/database');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// dayjs.extend(relativeTime);

var app = express();
app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "default",
    helpers: {
      emptyObject: (messages) => {
        return !(messages.constructor === Object && Object.keys(messages).length == 0);
      },
      FormatDate: (timestamp) => {
        return new Date(timestamp * 1000);
      },
      TimeSince: (timestamp) => {
        return dayjs(timestamp * 1000).fromNow();
      }
    }
  })
);
app.set("view engine", "hbs");

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  store: database.getSessionStore(),
  secret: "Don't tell",
  resave: false,
  saveUninitialized: false
}));
// app.use(flash());
app.use("/public", express.static(path.join(__dirname, 'public'), { fallthrough: false }));

/* This one gets called a lot. */
// app.use((req, res, next) => {
//     console.log("Setting locals.");
//     if(req.session.username) {
//         res.locals.session = req.session;
//         res.locals.logged = true;
//     }
//     next();
// });

app.use('/api', apiRouter);
app.use('/', indexRouter);        // If used, this must come last.

console.log("Setup complete.");

app.use((req, res) => {
  console.log(`app.js::errorTrap ${req.url}`);
  res.status(404);
  res.send();
});

module.exports = app;
