var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();
var routeProtectors = require('../middleware/routeProtectors');



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
 * Renders the page at URL '/'
 *************************************************************************************/
router.get('/', (req, res, next) => {
  res.render("home", {
    layout: 'globetrotter',
    filename: "home",
    title: "Home"
  });
});




router.get('/login', routeProtectors.userIsNotLoggedIn, (req, res, next) => {
  var message = "";
  if(req.query.message) {
    message = req.query.message;
  }
  res.render("login", {
    layout: false,
    filename: "login",
    title: "Login",
    message: message
  });
});



/*************************************************************************************
 * Renders the page at URL '/home'
 *************************************************************************************/
router.get('/home', (req, res, next) => {
  res.render("home", {
    layout: 'globetrotter',
    filename: "home",
    title: "Home"
  });
});



router.get('/accountmanagement', routeProtectors.userIsLoggedIn, (req, res, next) => {
  res.render("accountmanagement", {
    layout: 'globetrotter',
    filename: "accountmanagement",
    title: "Account Management"
  });
});



router.get('/test', async (req, res, next) => {
  res.render("test", {
    layout: 'globetrotter',
    title: "Test Page",

    // Get trip_id from your own database instance
    activities: await database.getFlightActivitiesByTripId(null)
  });
});



router.get('/registration', routeProtectors.userIsNotLoggedIn, (req, res, next) => {
  res.render("registration", {
    layout: 'globetrotter',
    filename: "registration",
    title: "Registration"
  });
});



router.get('/savedtrips', routeProtectors.userIsLoggedIn, (req, res, next) => {
  res.render("savedtrips", {
    layout: 'globetrotter',
    filename: "savedtrips",
    title: "Saved Trips"
  });
});



router.get('/checkout', routeProtectors.userIsLoggedIn, (req, res, next) => {
  res.render("checkout", {
    layout: 'globetrotter',
    filename: "checkout",
    title: "Checkout"
  });
});



router.get('/previoustrips', routeProtectors.userIsLoggedIn, (req, res, next) => {
  res.render("previoustrips", {
    layout: 'globetrotter',
    filename: "previoustrips",
    title: "Previous Trips"
  });
});



router.get('/photogallery', routeProtectors.userIsLoggedIn, (req, res, next) => {
  res.render("photogallery", {
    layout: 'globetrotter',
    filename: "photogallery",
    title: "Photo Gallery"
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
