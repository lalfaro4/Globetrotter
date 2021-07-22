/*************************************************************************************
 * Grabs the current protocol, host, and port being used to access the website.
 * 
 * Use this in place of localhost:port
 *************************************************************************************/
 function getURLBase() {
    return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
}



async function fetchURL(endpoint, parameters) {
    var url = new URL(getURLBase() + endpoint),
        params = parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    var response = await fetch(url, {
        method: "GET",
        headers: new Headers({
            // 'Authorization': `Bearer ${token}`,
        })
    });
    return response;
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




function searchClickHandler(event) {
    window.location.href = "/planner";
}

// Setup event listeners
document.getElementById('home-origin-input').addEventListener('input', locationInputEventHandler);
document.getElementById('home-destination-input').addEventListener('input', locationInputEventHandler);
document.getElementById("home-search-button").addEventListener('click', searchClickHandler);