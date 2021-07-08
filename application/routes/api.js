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
 * API Endpoint: GET /api/users
 *************************************************************************************/
router.get('/users', authorization, async (req, res, next) => {
  var users = await database.getAllUsers();
  if (users.length > 0) {
    log(`Found ${users.length} users.`, "success");
    res.send(users);
  } else {
    log("No users found.", "success");
    res.send({ result: "No users found." });
  }
});



/*************************************************************************************
 * API Endpoint: GET /api/users/search
 *************************************************************************************/
router.get('/users/search', authorization, async (req, res, next) => {
  var username = req.query.username;
  var email = req.query.email;
  var users;
  if (username) {
    users = await database.searchUsersByUsername(username);
  } else if (email) {
    users = await database.searchUsersByEmail(email);
  }
  if (users && users.length > 0) {
    log(`Found ${users.length} users.`, "success");
    res.send(JSON.stringify(users, null, 4));
  } else {
    log("No users found.", "success");
    res.send({ result: "No users found." });
  }
});



/*************************************************************************************
 * API Endpoint: GET /api/users/me
 *************************************************************************************/
router.get('/users/me', authorization, async (req, res, next) => {
  var token = WebTokens.extractToken(req);
  if (token) {
    try {
      var decodedToken = WebTokens.decodeToken(token);
      var user = await database.getUserByUsername(decodedToken.data);
      if (user) {
        log("Found you!", "success");
        res.send(user);
      } else {
        log("Could not find user.", "fail");
        res.send({ result: "Could not find user." });
      }
    } catch (error) {
      log("Invalid authorization token.", "fail");
      res.send({ result: "Invalid authorization token." });
    }
  } else {
    log("Missing authorization token.", "fail");
    res.send({ result: "Missing authorization token." });
  }
});



/*************************************************************************************
 * API Endpoint: PUT /api/users
 * 
 * Todo: Check if this is an update or creation (does user exist?)
 * May need a new database method.
 *************************************************************************************/
router.put('/users', authorization, async (req, res, next) => {
  var username = req.query.username;
  var password = req.query.password;
  var email = req.query.email;
  if (username && password && email) {
    var user = await database.createUser(username, password, email);
    if (user) {
      log("User created successfully.", "success");
      res.send({ result: "User created successfully." });
    } else {
      log("Error creating user.", "fail");
      res.send({ result: "Error creating user." });
    }
  } else {
    log("Missing parameter(s).", "fail");
    res.send({ result: "Missing parameter(s)." });
  }
});



/*************************************************************************************
 * API Endpoint: GET /api/flights
 *************************************************************************************/
router.get('/flights', authorization, async (req, res, next) => {
  if (req.query.originLocationCode &&
    req.query.destinationLocationCode &&
    req.query.departureDate &&
    req.query.adults &&
    req.query.currencyCode &&
    req.query.max) {
    var flights = await amadeusConnector.searchFlights(
      req.query.originLocationCode,
      req.query.destinationLocationCode,
      req.query.departureDate,
      req.query.adults,
      req.query.currencyCode,
      req.query.max);
    if (flights) {
      log("Retrieved flights.", "success");
      res.send(flights);
    } else {
      log("Error retrieving flights.", "fail");
      res.send({ result: "Error retrieving flights." });
    }
  } else {
    log("Missing parameters", "fail");
    res.send({ result: "Missing parameters" });
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
