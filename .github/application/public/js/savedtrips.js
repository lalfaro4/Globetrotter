/*************************************************************************************
 * Grabs the current protocol, host, and port being used to access the website.
 * 
 * Use this in place of localhost:port
 *************************************************************************************/
 function getURLBase() {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}

// Use to fetch a URL with GET.
async function fetchURL(method, endpoint, parameters) {
    var url = new URL(getURLBase() + endpoint),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    console.log(url);
    var response = await fetch(url, {
        method: method,
        headers: new Headers({
            // 'Authorization': `Bearer ${token}`,
        })
    });
    return response;
}


function editTripClickHandler(event) {
    var tripId = event.target.getAttribute('data-tripid');
    console.log(tripId);
    location.href = `/planner?trip_id=${tripId}`;
}

async function deleteTripClickHandler(event) {
    var tripId = event.target.getAttribute('data-tripid');
    console.log(tripId);
    await fetchURL('DELETE', `/trips/${tripId}`, []);
    location.reload();
}



var savedTripsEditButtons = document.getElementsByClassName('savedtrips-edit-button');
for(var savedTripsEditButton of savedTripsEditButtons) {
    savedTripsEditButton.addEventListener('click', editTripClickHandler);
}

var savedTripsDeleteButtons = document.getElementsByClassName('savedtrips-delete-button');
for(var savedTripsDeleteButton of savedTripsDeleteButtons) {
    savedTripsDeleteButton.addEventListener('click', deleteTripClickHandler);
}