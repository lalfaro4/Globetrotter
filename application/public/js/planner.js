

var token;
var trip_id = 'b48bbc8d-ea4c-11eb-b0c1-28d24427a5d8';
var trip;

var initialFlightActivities = [];
var flightActivitiesToCreate = [];
var flightActivitiesToDelete = [];

/*************************************************************************************
 * Grabs the current protocol, host, and port being used to access the website.
 * 
 * Use this in place of localhost:port
 *************************************************************************************/
function getURLBase() {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}



async function fetchURL(method, endpoint, parameters) {
    var url = new URL(getURLBase() + endpoint),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: method,
        headers: new Headers({
            // 'Authorization': `Bearer ${token}`,
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
    if (selectedActivityChildContainer.childElementCount == 0) {
        selectedActivityChildContainer.innerHTML = '';
        selectedActivityChildContainer.appendChild(copyOfFlightOffer);
    } else {
        selectedActivityChildContainer.replaceChild(copyOfFlightOffer, selectedActivityChildContainer.children[0]);
    }

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
    var flightsRendered = await (await fetchURL("GET", "/planner/flights", parameters)).text();
    document.getElementById("planner-results-placeholder").innerHTML = flightsRendered;
}



async function searchFlights(activity) {

    // Get data from the input fields of the activity
    var origin = activity.querySelector('.planner-activity-origin-input').value;
    var destination = activity.querySelector('.planner-activity-destination-input').value;
    var departure = activity.querySelector('.planner-activity-departure-date').value;
    var adults = 1;
    var currencyCode = 'USD';

    if (origin && destination && departure && adults && currencyCode) {
        console.log("Searching...");
        await loadFlights(origin, destination, departure, adults, currencyCode, 10);

        var resultItemButtons = document.getElementsByClassName("planner-result-item-button");
        for (var resultItemButton of resultItemButtons) {
            resultItemButton.addEventListener("click", addFlightClickHandler);
        }
    } else {
        console.log('Some search parameters are null.');
    }

}



/*************************************************************************************
* Event handler: Add activity button
*************************************************************************************/
function addActivityClickHandler(e) {
    var flightActivityTemplate = Handlebars.templates['flight-activity.hbs'];
    var trip = document.getElementById('planner-trip');
    trip.innerHTML += flightActivityTemplate({ index: trip.childElementCount });

    var newActivity = trip.children[trip.childElementCount - 1];
    configureActivityEventHandlers(newActivity);
    flightActivitiesToCreate.push(newActivity);

}



/*************************************************************************************
* Event handler: Proceed button
*************************************************************************************/
function proceedClickHandler(event) {
    window.location.href = '/checkout';
}



/*************************************************************************************
* Event handler: Remove activity button
*************************************************************************************/
function removeActivityClickHandler(e) {
    var activity = e.target.closest('.planner-activity');
    var activityId = activity.getAttribute('data-activity-id');
    flightActivitiesToDelete.push(activityId);
    activity.remove();
}



/*************************************************************************************
 *  Event handler: planner-activity
 ************************************************************************************/
function activityClickHandler(e) {

    var radioButton = this.children[0].children[0];
    radioButton.checked = true;

}


/*************************************************************************************
 *  Event handler: planner-activity-button
 ************************************************************************************/
async function activitySearchClickHandler(e) {

    console.log(e.target);

    // Make sure the click is not coming from one of the child elements
    if (e.target != this) {
        e.stopPropagation();
        return;
    }

    // Get the selected Activity by radio button

    // Get the selected Activity by checking the parent of the search button that was clicked
    var activity = e.target.closest('.planner-activity');
    var originInputValue = activity.querySelector('.planner-activity-origin-input').value;
    var originInputDatalist = activity.querySelector('.planner-origin-airports-datalist');
    var destinationInputValue = activity.querySelector('.planner-activity-destination-input').value;
    var destinationInputDatalist = activity.querySelector('.planner-destination-airports-datalist');
    
    if(isIncompleteActivity(activity)) {
        alert('Some search parameters are invalid.');
        return;
    }

    if (!validateAirportInput(originInputValue, originInputDatalist) || !validateAirportInput(destinationInputValue, destinationInputDatalist)) {
        alert('Please input a valid airport.');
        return;
    }


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

    // Disable page elements
    var tripPanel = document.getElementById('planner-trip-panel');
    tripPanel.classList.add('planner-disabled');

    // Load data or simulate with timeout
    await searchFlights(activity);
    // await new Promise(resolve => setTimeout(resolve, 20000));

    // Reenable page elements
    tripPanel.classList.remove('planner-disabled');

    document.getElementById('planner-results-container').removeChild(loaderContainer);
}



// Setup the airport search autocomplete
async function locationInputEventHandler(event) {

    var locationSearchInput = event.target;
    var datalistElement = locationSearchInput.nextSibling.nextSibling;

    await loadLocations(locationSearchInput, datalistElement);

}

async function loadLocations(locationSearchInput, datalistElement) {
    var airportResults = await (await fetchURL('GET', '/api/airports/search', { searchString: locationSearchInput.value })).json();
    datalistElement.innerHTML = '';
    for (var airport of airportResults) {
        var option = document.createElement('option');
        option.value = airport.iata_code;
        option.setAttribute('name', airport.iata_code);
        option.setAttribute('data-id', airport.location_name);
        option.text = airport.location_name;
        datalistElement.appendChild(option);
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
            // 'Authorization': `Bearer ${token}`,
        })
    });
    var flightActivitiesRendered = await response.text();
    document.getElementById("planner-trip").innerHTML = flightActivitiesRendered;
}



function configureActivityEventHandlers(activity) {
    activity.addEventListener('click', activityClickHandler);
    activity.querySelector('.planner-activity-origin-input').addEventListener('input', locationInputEventHandler);
    activity.querySelector('.planner-activity-destination-input').addEventListener('input', locationInputEventHandler);
    activity.querySelector('.planner-search-activity-button').addEventListener("click", activitySearchClickHandler);
    activity.querySelector('.planner-remove-activity-button').addEventListener("click", removeActivityClickHandler);
}



async function saveClickHandler(event) {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('trip_id');
    var tripName = document.getElementById('planner-trip-title-input').value;

    if(tripName=='') {
        alert('Please enter a valid name for your trip.');
        return;
    }

    for (var deletedActivityId of flightActivitiesToDelete) {
        var result = await fetchURL('DELETE', `/api/activities/${deletedActivityId}`, []);
        console.log(result);
    }
    for (var flightActivity of flightActivitiesToCreate) {
        var originCode = flightActivity.querySelector('.planner-activity-origin-input').value;
        var destinationCode = flightActivity.querySelector('.planner-activity-destination-input').value;
        var departureDate = flightActivity.querySelector('.planner-activity-departure-date').value;
        var flightOfferContainer = flightActivity.querySelector('.planner-result-item-data');
        var flightOfferJSONData = flightOfferContainer ? flightOfferContainer.innerText : null;
        if (!isIncompleteActivity(flightActivity)) {
            var result = await fetchURL('POST', `/api/activities`,
                {
                    tripId: tripId,
                    originCode: originCode, destinationCode: destinationCode,
                    startTime: departureDate + ' 00:00:00',
                    endTime: departureDate + ' 00:00:00',
                    flightOfferJSONData: flightOfferJSONData
                }
            );
        }
    }
    for (var flightActivity of initialFlightActivities) {
        var activityId = flightActivity.getAttribute('data-activity-id');
        var originCode = flightActivity.querySelector('.planner-activity-origin-input').value;
        var destinationCode = flightActivity.querySelector('.planner-activity-destination-input').value;
        var departureDate = flightActivity.querySelector('.planner-activity-departure-date').value;
        console.log('DEPART: ', departureDate);
        var flightOfferContainer = flightActivity.querySelector('.planner-result-item-data');
        var flightOfferJSONData = flightOfferContainer ? flightOfferContainer.innerText : null;
        if (isIncompleteActivity(flightActivity)) {
            alert('Some fields are incomplete');
            return;
        }
        var result = await fetchURL('PUT', `/api/activities/${activityId}`,
            {
                originCode: originCode, destinationCode: destinationCode,
                startTime: departureDate + ' 00:00:00',
                endTime: departureDate + ' 00:00:00',
                flightOfferJSONData: flightOfferJSONData
            }
        );
    }
    await fetchURL('POST', `/trips/${tripId}/update`, { tripName: tripName });
    location.href = '/savedtrips';
}



/*************************************************************************************
* Start: Anonymous async function
*************************************************************************************/
(async () => {
    // token = await authenticate();
    // await loadTrip(trip_id);

    var activities = document.getElementsByClassName('planner-activity');
    initialFlightActivities = activities;
    // var activityButtons = document.getElementsByClassName("planner-activity-header");
    // var activityRadioButtons = document.querySelectorAll('.planner-activity > label > [type=radio]:first-of-type');
    // var removeActivityButtons = document.getElementsByClassName("planner-remove-activity-button");



    // Process the preloaded activities
    for (var activity of activities) {


        var originInput = activity.querySelector('.planner-activity-origin-input');
        var originInputDatalistElement = activity.querySelector('.planner-origin-airports-datalist');
        loadLocations(originInput, originInputDatalistElement);

        var destinationInput = activity.querySelector('.planner-activity-destination-input');
        var destinationInputDatalistElement = activity.querySelector('.planner-destination-airports-datalist');
        loadLocations(destinationInput, destinationInputDatalistElement);

        // Setup the event listeners for the preloaded activities
        configureActivityEventHandlers(activity);

        // Setup the event listeners for the flight offers in the preloaded activities
        var flightOffer = activity.getElementsByClassName('planner-result-item')[0];
        if (flightOffer) {
            var button = flightOffer.querySelector('.planner-result-item-button');
            button.value = 'Reset';
            button.addEventListener('click', removeFlightClickHandler);
        }
    }

    // Setup click handler for add activity button
    document.querySelector('.planner-add-activity-button').addEventListener('click', addActivityClickHandler);

    // Setup click handler for save button
    document.querySelector('.planner-trip-save-button').addEventListener('click', saveClickHandler);

    // Setup click handler for the proceed button
    // document.querySelector('.planner-proceed-button').addEventListener('click', proceedClickHandler);



})();