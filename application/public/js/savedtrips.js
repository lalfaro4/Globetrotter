function editTripClickHandler(event) {
    var tripId = event.target.getAttribute('data-tripid');
    console.log(tripId);
    location.href = `/planner?trip_id=${tripId}`;
}



var savedTripsEditButtons = document.getElementsByClassName('savedtrips-edit-button');
for(var savedTripsEditButton of savedTripsEditButtons) {
    savedTripsEditButton.addEventListener('click', editTripClickHandler);
}