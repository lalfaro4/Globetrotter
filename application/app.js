var express = require('express');
var path = require('path');
var logger = require('morgan');
var handlebars = require('express-handlebars');
var session = require('express-session');
var database = require('./private/js/database');
var routeProtectors = require('./middleware/routeProtectors');

var apiRouter = require('./routes/api/api');
var indexRouter = require('./routes/pages/index');

// dayjs.extend(relativeTime);



var Handlebars = handlebars.create();



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
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('Stringify', function (object) {
  var result = JSON.stringify(object);
  return result;
});



/*************************************************************************************
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('Date', function (timestampString) {
  var result = timestampString.slice(0, 10);
  console.log(result);
  return result;
});



/*************************************************************************************
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('Year', function (timestampString) {
  var result = '';
  if (timestampString) {
    result = timestampString.slice(0, 4);
  }
  return result;
});



/*************************************************************************************
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('Month', function (timestampString) {
  var result = '';
  if (timestampString) {
    result = timestampString.slice(5, 7);
  }
  return result;
});



/*************************************************************************************
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('Day', function (timestampString) {
  var result = '';
  if (timestampString) {
    result = timestampString.slice(8, 10);
  }
  return result;
});



/*************************************************************************************
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('Time', function (timestampString) {
  var result = '';
  if (timestampString) {
    result = timestampString.slice(11, 20);
  }
  return result;
});



/*************************************************************************************
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('State', function (state) {
  var result = state.slice(0, 2);
  return result;
});



/*************************************************************************************
 * Handlebars Helper
 *************************************************************************************/
Handlebars.handlebars.registerHelper('Select', function (value, options) {
  var elements = options.fn(this);
  var newElements = elements.replace(`value="${value}"`, `value="${value}" selected="selected"`);
  return newElements;
});



/*************************************************************************************
 * Setup the Morgan logger in dev mode. All requests are printed in the server console.
 *************************************************************************************/
app.use(logger('dev'));



/*************************************************************************************
 * Not 100% sure.
 *************************************************************************************/
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
 * Create a publicly accessible folder at /public and restrict access to /public/images/uploads
 *************************************************************************************/

 app.use("/public/images/uploads", routeProtectors.userIsLoggedIn, express.static(path.join(__dirname, 'public/images/uploads'),
 { fallthrough: false })
);


app.use("/public", express.static(path.join(__dirname, 'public'),
  { fallthrough: false })
);



/*************************************************************************************
 * Sends the same session information that the user provided with their request back
 * in the response.
 *************************************************************************************/
app.use((req, res, next) => {
  log('Setting locals.', 'info');
  if (req.session.username) {
    res.locals.session = req.session;
    res.locals.logged = true;
    log('User is already logged in.', 'success');
  } else {
    log('User is not logged in.', 'info');
  }
  next();
});



/*************************************************************************************
 * Configure the two top level routers
 *************************************************************************************/
app.use('/api', apiRouter);
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