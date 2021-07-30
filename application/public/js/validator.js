

function validateAirportInput(inputValue, datalistElement) {
    for (var option of datalistElement.options) {
        var airportCode = option.value;
        if (inputValue == airportCode) {
            return true;
        }
    }
    return false;
}

function isIncompleteActivity(activity) {
    console.log(activity);
    var originCode = activity.querySelector('.planner-activity-origin-input').value;
    var destinationCode = activity.querySelector('.planner-activity-destination-input').value;
    var departureDate = activity.querySelector('.planner-activity-departure-date').value;
    console.log(departureDate);
    console.log(originCode, destinationCode, isNaN(Date.parse(departureDate)));
    if (originCode == '' || destinationCode == '' || isNaN(Date.parse(departureDate))) {
        return true;
    }
    return false;
}