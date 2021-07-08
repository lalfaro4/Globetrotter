const Amadeus = require('amadeus');

const clientId = "OfZVnMhIXyS34mDXVWztolvG2U0eLuN4";
const clientSecret = "hvOIqKZGxKUuNquC";



/*************************************************************************************
 * Logging function for amadeusConnector.js
 *************************************************************************************/
function log(message, type) {
    if (type == 'success') {
        console.log(`amadeusConnector.js:: ${message}`.bgMagenta.white);
    } else if (type == "info") {
        console.log(`amadeusConnector.js:: ${message}`.bgMagenta.white);
    } else if (type == 'fail') {
        console.log(`amadeusConnector.js:: ${message}`.italic.bgRed.black);
    }
}



/*************************************************************************************
* Setup the Amadeus SDK
*************************************************************************************/
var amadeus = new Amadeus({
    clientId: clientId,
    clientSecret: clientSecret
});



/*************************************************************************************
* Wrapper function for the Amadeus 'Flight Offers Search'
*************************************************************************************/
async function searchFlights(originLocationCode,
    destinationLocationCode,
    departureDate,
    adults,
    currencyCode,
    max) {
    log(`Flight Offers Search: Searching for flights from ${originLocationCode} to ${destinationLocationCode} on ${departureDate}`, "info");
    try {
        var response = await amadeus.shopping.flightOffersSearch.get({
            originLocationCode: originLocationCode,
            destinationLocationCode: destinationLocationCode,
            departureDate: departureDate,
            currencyCode: currencyCode,
            adults: adults,
            max: max
        });
        if (response) {
            log(`Found ${response.data.length} flights from ${originLocationCode} to ${destinationLocationCode}`, "success");
            for(const flight of response.data) {
                var departureTime = flight.itineraries[0].segments[0].departure.at;
                var arrivalTime = flight.itineraries[0].segments[0].arrival.at;
                var priceFormatted = new Intl.NumberFormat(undefined, { style: 'currency', currency: flight.price.currency }).format(flight.price.grandTotal);
                log(`Departure: ${departureTime} --> Arrival: ${arrivalTime} --- ${priceFormatted}`, "success");
            }
            return response.data;
        } else {
            log("Could not find any flights!", "fail");
            return false;
        }
    } catch (error) {
        log("Error while searching for flights.", "fail");
    }
}



/*************************************************************************************
* Make the functions usable from other modules
*************************************************************************************/
module.exports.searchFlights = searchFlights;