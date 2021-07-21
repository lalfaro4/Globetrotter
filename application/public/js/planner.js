


var token;
var trip_id = 'b48bbc8d-ea4c-11eb-b0c1-28d24427a5d8';



/*************************************************************************************
 * Grabs the current protocol, host, and port being used to access the website.
 * 
 * Use this in place of localhost:port
 *************************************************************************************/
function getURLBase() {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}



/*************************************************************************************
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



async function fetchURL(endpoint, parameters) {
    var url = new URL(getURLBase() + endpoint),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET",
        headers: new Headers({
            'Authorization': `Bearer ${token}`,
        })
    });
    return response;
}



/*************************************************************************************
* Event handler: planner-result-item-add-button
*************************************************************************************/
function addFlightClickHandler(e) {

    // Get the parent result item
    var resultItem = e.target.closest('.planner-result-item');
    var selectedActivity = document.querySelector('input[name="planner-selected-activity"]:checked').parentNode.parentNode;

    // Get the results container
    var resultsList = document.getElementById('planner-results-container');
    var currentChild = selectedActivity.children[1];
    if (currentChild.classList.contains('planner-result-item')) {
        console.log('Activity already has a flight.');

        // Move the current flight offer to the result list.
        resultsList.prepend(currentChild);
    } else {
        console.log('Activity has no associated flight offers.');
        currentChild.remove();
    }
    selectedActivity.appendChild(resultItem);

    // selectedActivity.replaceChild(resultItem, selectedActivity.children[1]);


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
    document.getElementById("planner-results-container").innerHTML = flightsRendered;
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
    await loadFlights(origin, destination, departure, adults, currencyCode, 5);

    var resultItemAddButtons = document.getElementsByClassName("planner-result-item-add-button");
    for (var addFlightButton of resultItemAddButtons) {
        addFlightButton.addEventListener("click", addFlightClickHandler);
    }
    // } else {
    //   console.log('Some search parameters are null.');
    // }


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

    // Get the activity that was clicked
    var activity = document.querySelector('input[name="planner-selected-activity"]:checked').parentNode.parentNode;

    // Create the loader
    var loader = document.createElement('div');
    loader.classList.add('loader');
    document.getElementById('planner-results-panel').appendChild(loader);

    // Load data or simulate with timeout
    await searchFlights(activity);
    // await new Promise(resolve => setTimeout(resolve, 250));

    document.getElementById('planner-results-panel').removeChild(loader);
}



// Setup the origin airport search
async function originInputEventHandler(event) {

    console.log(event.target);
    var airportResults = await (await fetchURL('/api/airports/search', { searchString: event.target.value } )).json();

    var dataList = e.target.nextSibling;
    console.log(dataList);
    originDataList.innerHTML = '';
    for(var airport of airportResults) {
        var option = document.createElement('option');
        option.value = airport.iata_code;
        option.setAttribute('name', airport.iata_code);
        option.setAttribute('data-id', airport.location_name);
        option.text = airport.location_name;
        // originDataList.appendChild(option);
    }

}



// Setup the destination airport search
async function destinationInputEventHandler(event) {

    console.log(event.target.value);
    var airportResults = await (await fetchURL('/api/airports/search', { searchString: destinationInput.value } )).json();

    destinationDataList.innerHTML = '';
    for(var airport of airportResults) {
        var option = document.createElement('option');
        option.value = airport.iata_code;
        option.setAttribute('name', airport.iata_code);
        option.setAttribute('data-id', airport.location_name);
        option.text = airport.location_name;
        // destinationDataList.appendChild(option);
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
    token = await authenticate();
    await loadTrip(trip_id);

    var activities = document.getElementsByClassName('planner-activity');
    var activityButtons = document.getElementsByClassName("planner-activity-header");
    var activityRadioButtons = document.querySelectorAll('.planner-activity > label > [type=radio]:first-of-type');
    var removeActivityButtons = document.getElementsByClassName("planner-remove-activity-button");



    // Setup the event listeners for autocomplete on the origin and destination inputs of each activity
    for (var activity of activities) {
        var originInput = activity.querySelector('.planner-activity-origin-input');
        originInput.addEventListener('input', originInputEventHandler);
        // var originDataList = activity.querySelector('.planner-origin-airports');
        var destinationInput = activity.querySelector('.planner-activity-destination-input');
        destinationInput.addEventListener('input', destinationInputEventHandler);
        // var destinationDataList = activity.querySelector('.planner-destination-airports');
    }


    // Setup the change handler for the selected activity
    for (var activityRadioButton of activityRadioButtons) {
        activityRadioButton.addEventListener('change', activityClickHandler);
    }



    // Setup the click handler for the remove activity buttons
    for (var button of removeActivityButtons) {
        button.addEventListener("click", removeActivityClickHandler);
    }
})();