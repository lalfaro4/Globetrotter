


var token;
var trip_id = '07176ff4-e8d0-11eb-bb81-28d24427a5d8';



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



/*************************************************************************************
* Loads activities by sending parameters to /planner/trip
* Places the rendered panel into planner-trip
*************************************************************************************/
async function loadTrip(trip_id) {
  var parameters = {
    trip_id: trip_id
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
 *  Event handler: planner-activity-button
 * ***********************************************************************************/
async function searchFlights(e) {
  if (e.target != this) {
    e.stopPropagation();
    return;
  }

  var origin = this.querySelector('.planner-activity-origin-input').value;
  var destination = this.querySelector('.planner-activity-destination-input').value;
  var departure = this.querySelector('.planner-activity-departure-date').value;
  var adults = 1;
  var currencyCode = 'USD';

  if (origin && destination && departure && adults && currencyCode) {
    document.getElementById("planner-results-list").innerHTML = "Loading...";



    console.log(this);
    this.disabled = true;
    // await loadFlights(origin, destination, departure, adults, currencyCode, 5);

    var resultItemAddButtons = document.getElementsByClassName("planner-result-item-add-button");
    for (var addFlightButton of resultItemAddButtons) {
      addFlightButton.addEventListener("click",



        /*************************************************************************************
        * Event handler: planner-result-item-add-button
        *************************************************************************************/
        function (e) {
          console.log(e.target);
        }



      );
    }
  } else {
    console.log('Some search parameters are null.');
  }
}



/*************************************************************************************
* Event handler: Remove activity button
*************************************************************************************/
function removeActivity(e) {
  e.target.closest('.planner-activity').remove();
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
  var url = new URL(getURLBase() + "/planner/flights"),
    params = parameters
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  var response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      'Authorization': `Bearer ${token}`,
    })
  });
  var flightsRendered = await response.text();
  document.getElementById("planner-results-list").innerHTML = flightsRendered;
}


/*************************************************************************************
* Start: Anonymous async function
*************************************************************************************/
(async () => {
  token = await authenticate();
  await loadTrip(trip_id);


  var activityButtons = document.getElementsByClassName("planner-activity-header");
  var removeActivityButtons = document.getElementsByClassName("planner-remove-activity-button");

  for (var activityButton of activityButtons) {
    // activityButton.addEventListener("click", searchFlights);
    for (var button of removeActivityButtons) {
      button.addEventListener("click", removeActivity);
    }
  }
})();