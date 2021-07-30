var express = require('express');
const amadeusConnector = require('../../private/js/amadeusConnector');
var { log } = require('./logger');
var router = express.Router();



/*************************************************************************************
 * API Endpoint: GET /api/flights
 *************************************************************************************/
 router.get('/', async (req, res, next) => {
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
 * Make the router usable from other modules.
 *************************************************************************************/
module.exports = router;
