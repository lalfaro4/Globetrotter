var colors = require('colors');
var express = require('express');
var database = require('../../private/js/database');
const WebTokens = require('../../private/js/webTokens');

var activitiesRouter = require('./activities');
var airportsRouter = require('./airports');
var flightsRouter = require('./flights');
var tripsRouter = require('./trips');
var usersRouter = require('./users');

var { log } = require('./logger');

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
    log("User authenticated successfully.", "success");
    res.send({ user: user, token: token });
  } else {
    log("Username or password incorrect.", "fail");
    res.send({ result: "Username or password incorrect." });
  }
});



/*************************************************************************************
 * Setup the routers for the other endpoints
 *************************************************************************************/
router.use('/activities', activitiesRouter);
router.use('/airports', airportsRouter);
router.use('/flights', flightsRouter);
router.use('/trips', tripsRouter);
router.use('/users', usersRouter);



/*************************************************************************************
 * Error trap for all invalid API requests.
 *************************************************************************************/
router.use((req, res) => {
  log(`${req.url}`, "fail");
  res.send('Error accessing API');
});



/*************************************************************************************
 * Make the router usable from other modules.
 *************************************************************************************/
module.exports = router;
