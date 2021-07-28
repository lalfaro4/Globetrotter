var colors = require('colors');
var express = require('express');
var database = require('../private/js/database');
const WebTokens = require('../private/js/webTokens');
const amadeusConnector = require('../private/js/amadeusConnector');
const { authorization } = require('../middleware/routeProtectors');
var colors = require('colors');
var router = express.Router();



/*************************************************************************************
 * Logging function for api.js
 *************************************************************************************/
function log(message, type) {
  if (type == 'success') {
    console.log(`api.js:: ${message}`.bgBrightYellow.black);
  } else if (type == "info") {
    console.log(`api.js:: ${message}`.bgBrightYellow.black);
  } else if (type == 'fail') {
    console.log(`api.js:: ${message}`.italic.bgRed.black);
  }
}



/*************************************************************************************
 * API Endpoint: GET /api/authenticate
 *************************************************************************************/
router.get('/authenticate', async (req, res, next) => {
  var username = req.query.username;
  var password = req.query.password;
  var user = await database.authenticate(username, password);
  if (user) {
    var token = WebTokens.getNewToken(user.username);
    log("User authenticated successfully.", "success");
    res.send({ user: user, token: token });
  } else {
    log("Username or password incorrect.", "fail");
    res.send({ result: "Username or password incorrect." });
  }
});



/*************************************************************************************
 * Error trap for all invalid API requests.
 *************************************************************************************/
router.use((req, res) => {
  log(`${req.url}`, "fail");
  res.redirect(404, "/");
});



/*************************************************************************************
 * Make the router usable from other modules.
 *************************************************************************************/
module.exports = router;
