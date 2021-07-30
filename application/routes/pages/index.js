var express = require('express');
var router = express.Router();
var routeProtectors = require('../../middleware/routeProtectors');

var accountManagementRouter = require('./accountmanagement');
var checkoutRouter = require('./checkout');
var usersRouter = require('./users');
var plannerRouter = require('./planner');
var photoGalleryRouter = require('./photogallery');
var aboutRouter = require('./about');
var previousTripsRouter = require('./previoustrips');
var resetPasswordRouter = require('./resetpassword');
var savedTripsRouter = require('./savedtrips');
var tripsRouter = require('./trips');



/*************************************************************************************
 * Logging function for index.js
 *************************************************************************************/
function log(message, type) {
  if (type == 'success') {
    console.log(`index.js:: ${message}`.bgWhite.black);
  } else if (type == "info") {
    console.log(`index.js:: ${message}`.bgWhite.black);
  } else if (type == 'fail') {
    console.log(`index.js:: ${message}`.italic.bgRed.black);
  }
}

/*************************************************************************************
 * Renders the page at URL '/login'
 *************************************************************************************/
router.get('/login', routeProtectors.userIsNotLoggedIn, (req, res, next) => {
  var message = "";
  if (req.query.message) {
    message = req.query.message;
  }
  res.render("login", {
    layout: false,
    filename: "login",
    title: "Login",
    message: message
  });
});

router.use('/about', aboutRouter);
router.use('/accountmanagement', routeProtectors.userIsLoggedIn, accountManagementRouter);
router.use('/checkout', routeProtectors.userIsLoggedIn, checkoutRouter);
router.use('/photogallery', routeProtectors.userIsLoggedIn, photoGalleryRouter);
router.use('/planner', routeProtectors.userIsLoggedIn, plannerRouter);
router.use('/previoustrips', routeProtectors.userIsLoggedIn, previousTripsRouter);
router.use('/resetpassword', resetPasswordRouter);
router.use('/savedtrips', routeProtectors.userIsLoggedIn, savedTripsRouter);
router.use('/trips', routeProtectors.userIsLoggedIn, tripsRouter);
router.use('/users', usersRouter);

router.get('/home', (req, res, next) => {
  res.render("home", {
    layout: 'globetrotter',
    filename: "registration",
    title: "Home"
  });
});

router.get('/registration', routeProtectors.userIsNotLoggedIn, (req, res, next) => {
  var message = req.query.message;
  res.render("registration", {
    layout: 'globetrotter',
    filename: "registration",
    title: "Registration",
    message: message
  });
});

router.get('/', (req, res, next) => {
  res.render("home", {
    layout: 'globetrotter',
    filename: "home",
    title: "Home"
  });
});

/*************************************************************************************
 * Error trap for any URL's that the router doesn't know how to handle.
 *************************************************************************************/
router.use((req, res) => {
  console.log(`index.js::errorTrap ${req.url}`);
  res.redirect(404, "/");
});

/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
module.exports = router;