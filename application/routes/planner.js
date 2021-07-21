var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();

console.log("T");

/*************************************************************************************
 * Logging function for planner.js
 *************************************************************************************/
function log(message, type) {
    if (type == 'success') {
        console.log(`planner.js:: ${message}`.bgBrightYellow.black);
    } else if (type == "info") {
        console.log(`planner.js:: ${message}`.bgBrightYellow.black);
    } else if (type == 'fail') {
        console.log(`planner.js:: ${message}`.italic.bgRed.black);
    }
}



/*************************************************************************************
* Renders the page at URL '/planner'
*************************************************************************************/
router.get('/', (req, res, next) => {
    res.render("planner", {
        title: "Route Planner"
    });
});



/*************************************************************************************
* Renders the page at URL '/planner/trip'
*************************************************************************************/
router.get('/trip', async (req, res, next) => {
    if (req.query.trip_id) {
        var flightActivities = await database.getFlightActivitiesByTripId(req.query.trip_id);

        if (flightActivities) {
            log("Retrieved flight activities for trip.", "success");
            res.render("partials/planner/trip", {
                layout: false,
                activities: flightActivities
            });
        } else {
            log("Error retrieving flight activities.", "fail");
            res.send({ result: "Error retrieving activities." });
        }
    } else {
        log("Missing parameters", "fail");
        res.send({ result: "Missing parameters" });
    }
});



/*************************************************************************************
 * Renders the page at URL '/planner/flights'
 * 
 * Calls the Amadeus API and renders the flights inside of a results-list.
 * Manipulating data so that it works with the UI elements should be done here.
 *************************************************************************************/
router.get('/flights', async (req, res, next) => {
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

            // Begin manipulating the data returned from the Amadeus API
            for (var flight of flights) {
                for (var itinerary of flight.itineraries) {
                    for (var segment of itinerary.segments) {

                        // Departure and arrival datetimes are returned as yyyy-MM-dd hh:mm:ss from Amadeus
                        // but the <input type='time'> field only accepts hh:mm:ss so we take the last
                        // 8 chars of the datetimes.
                        segment.departure.at = segment.departure.at.slice(-8);
                        segment.arrival.at = segment.arrival.at.slice(-8);

                        // Get the Airline name from our database
                        var airlineCode = segment.carrierCode;
                        var airlineName = (await database.getAirlineNameFromIATACode(airlineCode))[0].service_provider_name;
                        segment.carrierName = airlineName;

                    }
                }
            }

            log("Retrieved flights.", "success");
            res.render("partials/planner/results-list", {
                layout: false,
                flights: flights
            });
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
 * Error trap for any URL's that the router doesn't know how to handle.
 *************************************************************************************/
router.use((req, res) => {
    console.log(`planner.js::errorTrap ${req.url}`);
    res.redirect(404, "/");
});



/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
 module.exports = router;