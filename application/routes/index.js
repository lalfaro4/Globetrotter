var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();



/*************************************************************************************
 * Logging function for index.js
 *************************************************************************************/
 function log(message, type) {
  if (type == 'success') {
    console.log(`index.js:: ${message}`.bgBrightYellow.black);
  } else if (type == "info") {
    console.log(`index.js:: ${message}`.bgBrightYellow.black);
  } else if (type == 'fail') {
    console.log(`index.js:: ${message}`.italic.bgRed.black);
  }
}



/*************************************************************************************
 * Sends the same session information that the user provided with their request back
 * in the response.
 *************************************************************************************/
/* This gets called at the beginning of every request from a client.
 */
router.use((req, res, next) => {
  console.log("Setting locals.");
  if(req.session.token) {
      res.locals.session = req.session;
      res.locals.logged = true;
  } else {
    console.log('User has no token');
  }
  next();
});



/*************************************************************************************
 * Renders the page at URL '/'
 *************************************************************************************/
router.get('/', (req, res, next) => {
  res.render("welcome", {
    title: "Welcome"
  });
});

router.get('/search', (req, res, next) => {
  res.render("search", {
    title: "Search"
  });

});



/*************************************************************************************
 * Renders the page at URL '/home'
 *************************************************************************************/
router.get('/home', (req, res, next) => {
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
