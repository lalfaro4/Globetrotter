const Amadeus = require('amadeus');

const clientId = "OfZVnMhIXyS34mDXVWztolvG2U0eLuN4";
const clientSecret = "hvOIqKZGxKUuNquC";

var amadeus = new Amadeus({
    clientId: clientId,
    clientSecret: clientSecret
});

async function searchFlights(originLocationCode,
                            destinationLocationCode,
                            departureDate,
                            adults,
                            currencyCode,
                            max) {
    var response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: originLocationCode,
        destinationLocationCode: destinationLocationCode,
        departureDate: departureDate,
        currencyCode: currencyCode,
        adults: adults, 
        max: max
    });
    if(response) {
        return response.data;
    } else {
        return false;
    }
}



module.exports.searchFlights = searchFlights;