var express = require('express');
var database = require('../../private/js/database');
var { log } = require('./logger');
var router = express.Router();



/*************************************************************************************
* API Endpoint: GET /api/trips, Returns all trips in the databse
*************************************************************************************/
router.get('/', async (req, res, next) => {
    console.log('/tripss');
    var trips = await database.getAllTrips();
    if (trips) {
        res.send(trips);
    } else {
        log("Error getting trips.", "fail");
        res.send({ result: "Error getting trips." });
    }
});



/*************************************************************************************
* API Endpoint: GET /api/trips
*************************************************************************************/
router.get('/:tripId/flightactivities', async (req, res, next) => {
    console.log(req.params.tripId);
    var flightActivities = await database.getFlightActivitiesByTripId(req.params.tripId);
    if (flightActivities) {
        res.send(flightActivities);
    } else {
        log("Error getting flight activities.", "fail");
        res.send({ result: "Error getting flight activities." });
    }
});



/*************************************************************************************
* Make the router usable from other modules.
*************************************************************************************/
module.exports = router;
