var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();



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
    layout: 'globetrotter_v2',
    filename: "home",
    title: "Home"
  });
});




router.get('/login', (req, res, next) => {
  res.render("login", {
    layout: false,
    filename: "login",
    title: "Login"
  });
});



/*************************************************************************************
 * Renders the page at URL '/home'
 *************************************************************************************/
router.get('/home', (req, res, next) => {
  res.render("home", {
    layout: 'globetrotter_v2',
    filename: "home",
    title: "Home"
  });
});



router.get('/accountmanagement', (req, res, next) => {
  res.render("accountmanagement", {
    layout: 'globetrotter_v2',
    filename: "accountmanagement",
    title: "Account Management"
  });
});



router.get('/registration', (req, res, next) => {
  res.render("registration", {
    layout: 'globetrotter_v2',
    filename: "registration",
    title: "Registration"
  });
});



router.get('/savedtrips', (req, res, next) => {
  res.render("savedtrips", {
    layout: 'globetrotter_v2',
    filename: "savedtrips",
    title: "Saved Trips"
  });
});



router.get('/checkout', (req, res, next) => {
  res.render("checkout", {
    layout: 'globetrotter_v2',
    filename: "checkout",
    title: "Checkout"
  });
});



router.get('/previoustrips', (req, res, next) => {
  res.render("previoustrips", {
    layout: 'globetrotter_v2',
    filename: "previoustrips",
    title: "Previous Trips"
  });
});



router.get('/photogallery', (req, res, next) => {
  res.render("photogallery", {
    layout: 'globetrotter_v2',
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
