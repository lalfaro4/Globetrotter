var colors = require('colors');
var express = require('express');
var database = require('../private/js/database');
const WebTokens = require('../private/js/webTokens');
const amadeusConnector = require('../private/js/amadeusConnector');
const { authorization } = require('../middleware/routeProtectors');
var colors = require('colors');
var router = express.Router();



/*************************************************************************************
 * API Endpoint: GET /api/authenticate
 *************************************************************************************/
router.get('/authenticate', async (req, res, next) => {
  var username = req.query.username;
  var password = req.query.password;
  var user = await database.authenticate(username, password);
  if (user) {
    var token = WebTokens.getNewToken(user.username);
    res.send({ user: user, token: token });
  } else {
    res.send({ result: "Username or password incorrect." });
  }
});



/*************************************************************************************
 * API Endpoint: GET /api/users
 *************************************************************************************/
router.get('/users', authorization, async (req, res, next) => {
  var users = await database.getAllUsers();
  res.send(users);
});



/*************************************************************************************
 * API Endpoint: GET /api/users/search
 * 
 * Todo: Check whether 
 *************************************************************************************/
 router.get('/users/search', authorization, async (req, res, next) => {
  console.log("Searching for users...".cyan);
  var searchString = req.query.searchString;
  var users = await database.searchUsersByUsername(searchString);
  console.log(`Found ${users.length} users.`.green);
  if(users.length > 0) {
    res.send(JSON.stringify(users, null, 4));
  } else {
    res.send({ result: "No users found." });
  }
});



/*************************************************************************************
 * API Endpoint: GET /api/users/me
 *************************************************************************************/
router.get('/users/me', authorization, async (req, res, next) => {
  var token = WebTokens.extractToken(req);
  if(token) {
    try {
      var decodedToken = WebTokens.decodeToken(token);
      var user = await database.getUserByUsername(decodedToken.data);
      res.send(user);
    } catch(error) {
      res.send({ result: "Invalid authorization token." });
    }
  } else {
    res.send({ result: "Missing authorization token." });
  }
});



/*************************************************************************************
 * API Endpoint: PUT /api/users
 *************************************************************************************/
router.put('/users', authorization, async (req, res, next) => {
  var username = req.query.username;
  var password = req.query.password;
  var user = await database.createUser(username, password);
  if (user) {
    res.send({ result: "User created successfully."});
  } else {
    res.send({ result: "Error creating user." });
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
      console.log(`Found ${flights.length} flights from ${req.query.originLocationCode} to ${req.query.destinationLocationCode}`.green);
      res.send(flights);
    } else {
      res.send({ result: "Error retrieving flights" });
    }
  } else {
    res.send({ result: "Missing parameters" });
  }
});



/*************************************************************************************
 * Error trap for all invalid API requests.
 *************************************************************************************/
router.use((req, res) => {
  console.log(`api.js::errorTrap ${req.url}`.red);
  res.redirect(404, "/");
});



/*************************************************************************************
 * Make the router usable from other modules.
 *************************************************************************************/
module.exports = router;
