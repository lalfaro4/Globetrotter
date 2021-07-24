


var token;
var trip_id = '';



/*************************************************************************************
 * Grabs the current protocol, host, and port being used to access the website.
 * 
 * Use this in place of localhost:port
 *************************************************************************************/
function getURLBase() {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}



/*************************************************************************************
 * Not used anymore. Will remove soon.
 * 
 * We are using sessions to track logged in users instead of tokens.
 * 
 * Authenticates the user with and returns the authorization token.
 *************************************************************************************/
async function authenticate() {
    var url = new URL(getURLBase() + "/api/authenticate"),
        params = { username: 'globetrotter', password: 'globetrotter' }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET"
    });
    return (await response.json()).token;
};



/*************************************************************************************
 * This is a utility function for creating a GET request using client JavaScript.
 * 
 * Endpoint is the URL of the resource you want to GET i.e. /planner/flights and 
 * Parameters is a key-value object of query parameters i.e. { trip_id: "fsf-dfsf-348"}
 * 
 * This performs a GET request on a URL such as /planner/flights?trid_id=fsf-dfsf-348
 *************************************************************************************/
async function fetchURL(endpoint, parameters) {
    var url = new URL(getURLBase() + endpoint),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET",
        headers: new Headers({
        })
    });
    return response;
}



/*************************************************************************************
* Event handler for planner-result-item-button when it is within an Activity
*************************************************************************************/
function removeFlightClickHandler(e) {
    // Get the parent result item of the button
    var resultItem = e.target.closest('.planner-result-item');
    resultItem.remove();
}



/*************************************************************************************
* Event handler for planner-result-item-button when it is in the result list
*************************************************************************************/
function addFlightClickHandler(e) {

    // Get the parent result item of the button
    var resultItem = e.target.closest('.planner-result-item');

    // Get the currently selected Activity and child container
    var selectedActivity = document.querySelector('input[name="planner-selected-activity"]:checked').parentNode.parentNode;
    var selectedActivityChildContainer = selectedActivity.querySelector('.planner-activity-child-container');

    // Get the results container
    var resultsList = document.getElementById('planner-results-container');

    // Make a copy of the flight offer
    var copyOfFlightOffer = resultItem.cloneNode(true);
    var flightOfferButton = copyOfFlightOffer.querySelector('.planner-result-item-button')
    flightOfferButton.value = 'Reset';
    flightOfferButton.addEventListener('click', removeFlightClickHandler);

    // Move the result item (new flight offer) uner the selected Activity
    selectedActivityChildContainer.appendChild(copyOfFlightOffer);

}



/*************************************************************************************
* Loads the flight results by sending parameters to /planner/flights
* Places the rendered panel into planner-results-list
*************************************************************************************/
async function loadFlights(origin, destination, departure, adults, currencyCode, max) {
    var parameters = {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departure,
        adults: adults,
        currencyCode: currencyCode,
        max: max
    };
    var flightsRendered = await (await fetchURL("/planner/flights", parameters)).text();
    document.getElementById("planner-results-placeholder").innerHTML = flightsRendered;
}



async function searchFlights(activity) {

    // Get data from the input fields of the activity
    var origin = activity.querySelector('.planner-activity-origin-input').value;
    var destination = activity.querySelector('.planner-activity-destination-input').value;
    var departure = activity.querySelector('.planner-activity-departure-date').value;
    var adults = 1;
    var currencyCode = 'USD';

    // if (origin && destination && departure && adults && currencyCode) {
    console.log("Searching...");
    await loadFlights(origin, destination, departure, adults, currencyCode, 10);

    var resultItemButtons = document.getElementsByClassName("planner-result-item-button");
    for (var resultItemButton of resultItemButtons) {
        resultItemButton.addEventListener("click", addFlightClickHandler);
    }
    // } else {
    //   console.log('Some search parameters are null.');
    // }


}



function addActivityClickHandler(e) {

    var trip = document.getElementById("planner-trip");
    var flightActivityTemplate = Handlebars.templates['flight-activity.hbs'];
    trip.innerHTML += flightActivityTemplate( { index: document.getElementById('planner-trip').childElementCount } );

    // Setup the autocomplete
    var newActivity = trip.lastChild;
    newActivity.querySelector('.planner-activity-origin-input').addEventListener('input', locationInputEventHandler);
    newActivity.querySelector('.planner-activity-destination-input').addEventListener('input', locationInputEventHandler);

    // Setup the radio button change handler
    // Each activity is configured as a radio button in the list so that only one can be selected at a time.
    // Disabled in favor of a search button for each activity
    // var radioButton = newActivity.querySelector('label > [type=radio]:first-of-type');
    // radioButton.addEventListener('change', activityClickHandler);

    // Setup the search button
    newActivity.querySelector('.planner-search-activity-button').addEventListener("click", activityClickHandler);
    
    // Setup the remove activity button
    newActivity.querySelector('.planner-remove-activity-button').addEventListener("click", removeActivityClickHandler);
    
    // document.getElementById('planner-trip').appendChild(newActivity);
}



function proceedClickHandler(event) {
    window.location.href = '/checkout';
}



/*************************************************************************************
* Event handler: Remove activity button
*************************************************************************************/
function removeActivityClickHandler(e) {
    e.target.closest('.planner-activity').remove();
}



/*************************************************************************************
 *  Event handler: planner-activity-button
 ************************************************************************************/
async function activityClickHandler(e) {

    // Make sure the click is not coming from one of the child elements
    if (e.target != this) {
        e.stopPropagation();
        return;
    }

    // Get the selected Activity by radio button
    // var activity = document.querySelector('input[name="planner-selected-activity"]:checked').parentNode.parentNode;

    // Get the selected Activity by checking the parent of the search button that was clicked
    var activity = e.target.closest('.planner-activity');

    // Create the loader
    var loaderContainer = document.createElement('div');
    var loader = document.createElement('div');
    var loaderLabel = document.createElement('div');
    loader.classList.add('loader');
    loaderLabel.style.textAlign = 'center';
    loaderLabel.textContent = "Searching...";
    loaderContainer.appendChild(loader);
    loaderContainer.appendChild(loaderLabel);
    document.getElementById('planner-results-container').prepend(loaderContainer);

    // Disable input page elements while the flights are loading
    // Todo 

    // Load data or simulate with timeout
    await searchFlights(activity);
    // await new Promise(resolve => setTimeout(resolve, 20000));

    // Reenable input page elements
    // Todo

    // Remove the loader since the data has been retrieved
    document.getElementById('planner-results-container').removeChild(loaderContainer);
}



// Setup the airport search autocomplete
async function locationInputEventHandler(event) {

    var airportResults = await (await fetchURL('/api/airports/search', { searchString: event.target.value } )).json();

    var dataList = event.target.nextSibling.nextSibling;
    dataList.innerHTML = '';
    for(var airport of airportResults) {
        var option = document.createElement('option');
        option.value = airport.iata_code;
        option.setAttribute('name', airport.iata_code);
        option.setAttribute('data-id', airport.location_name);
        option.text = airport.location_name;
        dataList.appendChild(option);
    }

}



/*************************************************************************************
* Loads activities by sending parameters to /planner/trip
* Places the rendered panel into planner-trip
*************************************************************************************/
async function loadTrip(tripId) {
    var parameters = {
        trip_id: tripId
    };
    var url = new URL(getURLBase() + "/planner/trip"),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET",
        headers: new Headers({
            'Authorization': `Bearer ${token}`,
        })
    });
    var flightActivitiesRendered = await response.text();
    document.getElementById("planner-trip").innerHTML = flightActivitiesRendered;
}



/*************************************************************************************
* Start: Anonymous async function
*************************************************************************************/
(async () => {
    // token = await authenticate();
    // await loadTrip(trip_id);

    var activities = document.getElementsByClassName('planner-activity');
    var activityButtons = document.getElementsByClassName("planner-activity-header");
    var activitySearchButtons = document.querySelectorAll('.planner-search-activity-button');
    var removeActivityButtons = document.getElementsByClassName("planner-remove-activity-button");



    // Setup the event listeners for autocomplete on the origin and destination inputs of each activity
    for (var activity of activities) {
        activity.querySelector('.planner-activity-origin-input').addEventListener('input', locationInputEventHandler);
        activity.querySelector('.planner-activity-destination-input').addEventListener('input', locationInputEventHandler);
    }



    // Setup the search handler for the selected activity
    for (var activitySearchButton of activitySearchButtons) {
        activitySearchButton.addEventListener('click', activityClickHandler);
    }



    // Setup the click handler for the remove activity buttons
    for (var button of removeActivityButtons) {
        button.addEventListener("click", removeActivityClickHandler);
    }



    // Setup click handler for add activity button
    document.querySelector('.planner-add-activity-button').addEventListener('click', addActivityClickHandler);

    // Setup click handler for the proceed button
    document.querySelector('.planner-proceed-button').addEventListener('click', proceedClickHandler);

})();