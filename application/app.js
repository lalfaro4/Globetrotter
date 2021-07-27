var express = require('express');
var path = require('path');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var session = require('express-session');
var database = require('./private/js/database');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');
var plannerRouter = require('./routes/planner');
var photoGalleryRouter = require('./routes/photogallery');
var aboutRouter = require('./routes/about');
// dayjs.extend(relativeTime);



/*************************************************************************************
 * Logging function for routeProtector.js
 *************************************************************************************/
 function log(message, type) {
  if (type == 'success') {
      console.log(`app.js:: ${message}`.bgWhite.green);
  } else if (type == "info") {
      console.log(`app.js:: ${message}`.bgWhite.yellow);
  } else if (type == 'fail') {
      console.log(`app.js:: ${message}`.italic.bgRed.black);
  }
}



/*************************************************************************************
* Create a new Express app
**************************************************************************************/
var app = express();



/*************************************************************************************
 * Setup Handlebars as the 'view engine' for Express
 *************************************************************************************/
app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "globetrotter",
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



/*************************************************************************************
 * More Handlebars setup
 *************************************************************************************/
app.set("view engine", "hbs");



/*************************************************************************************
 * Setup the Morgan logger in dev mode. All requests are printed in the server console.
 *************************************************************************************/
app.use(logger('dev'));
// app.use(logger(function (tokens, req, res) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     req.headers.authorization.split(' ')[1]
//   ].join(' ')
// }));
app.use(express.json());



/*************************************************************************************
 * Not 100% sure.
 *************************************************************************************/
app.use(express.urlencoded({ extended: false }));



/*************************************************************************************
 * Setup the session module to create user sessions in the database.
 *************************************************************************************/
app.use(session({
  store: database.getSessionStore(),
  secret: "Don't tell",
  resave: false,
  saveUninitialized: false
}));



/*************************************************************************************
 * Create a publicly accessible folder at /public
 *************************************************************************************/
app.use("/public", express.static(path.join(__dirname, 'public'),
  { fallthrough: false })
);



/*************************************************************************************
 * Sends the same session information that the user provided with their request back
 * in the response.
 *************************************************************************************/
app.use((req, res, next) => {
  log('Setting locals.', 'info');
  if(req.session.username) {
      res.locals.session = req.session;
      res.locals.logged = true;
      log('User is already logged in.', 'success');
  } else {
    log('User is not logged in.', 'info');
  }
  next();
});



/*************************************************************************************
 * Use the apiRouter for all URL's beginning with /api
 *************************************************************************************/
app.use('/api', apiRouter);



/*************************************************************************************
 * Use the usersRouter for all URL's beginning with /users
 *************************************************************************************/
 app.use('/users', usersRouter);



/*************************************************************************************
 * Use the plannerRouter for all URL's beginning with /planner
 *************************************************************************************/
app.use('/planner', plannerRouter);



/*************************************************************************************
 * Use the photoGalleryRouter for all URL's beginning with /photogallery
 *************************************************************************************/
 app.use('/photogallery', photoGalleryRouter);



 /*************************************************************************************
 * Use the aboutRouter for all URL's beginning with /about
 *************************************************************************************/
  app.use('/about', aboutRouter);



/*************************************************************************************
 * Use the indexRouter for all other URL's
 *************************************************************************************/
app.use('/', indexRouter);        // If used, this must come last.



/*************************************************************************************
 * Log an error whenever a URL is not handled by another router.
 *************************************************************************************/
app.use((req, res) => {
  console.log(`app.js::errorTrap ${req.url}`);
  res.status(404);
  res.send();
});

module.exports = app;