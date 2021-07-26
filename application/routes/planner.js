var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}



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
router.get('/', async (req, res, next) => {
    log('/planner', 'info');

    var activities;
    if(req.query.trip_id) {
        console.log(1);
        activities = await database.getFlightActivitiesByTripId(req.query.trip_id);
        var counter = 0;
        for(var activity of activities) {
            activity.index = counter++;
            if(activity.flight_offer_json_data) {
                log(activity.flight_offer_json_data, 'info');
                activity.flight_offer_json_data = JSON.parse(activity.flight_offer_json_data);
            }
        }
    } else {
        console.log(2);
        activities = [ { index: 0, origin_airport_code: req.query.origin,
            destination_airport_code: req.query.destination,

            // Set the departure date for tomorrow
            departure_date: new Date(Date.now() + 24*3600000).toISOString().split('T')[0]
        } ];
    }
    
    
    // 
    // Render the Route Planner and sends the response to the client. 
    // Activities is passed in as context which Handlebars can read in (planner.hbs).
    // This allows us to use variables inside of the hbs file based on what the 
    // query parameters in the URL i.e. /planner?origin=LAX&destination=SFO
    //
    res.render("planner", {
        layout: 'globetrotter',
        filename: 'planner',
        title: "Route Planner",
        activities: activities
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
* Renders sample data for the page at URL '/planner/trip'
*************************************************************************************/
router.get('/trip/sample', async (req, res, next) => {
    log("Retrieved sample flight activities for trip.", "success");
    res.render("partials/planner/trip", {
        layout: false,
        activities: new Array(getRandomInt(1, 4)).fill({})
    });
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
                        var airline = (await database.getAirlineNameFromIATACode(airlineCode))[0];
                        if(airline) {
                            var airlineName = airline.service_provider_name;
                            segment.carrierName = airlineName;
                        }

                    }
                }
            }

            log(`Retrieved ${flights.length} flights.`, "success");
            if (flights.length) {
                res.render("partials/planner/results-list", {
                    layout: false,
                    flights: flights
                });
            } else {
                res.send( { result: "No flights available. The date may have already passed, may be too far in the future, or you might have picked a weird airport."})
            }
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
 * Renders sample data for the page at URL '/planner/flights'
 *************************************************************************************/
router.get('/flights/sample', async (req, res, next) => {
    log("Retrieved sample flights.", "success");
    res.render("partials/planner/results-list", {
        layout: false,
        flights: new Array(getRandomInt(1, 6)).fill({})
    });
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