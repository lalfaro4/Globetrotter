function editTripClickHandler(event) {
    var tripId = event.target.getAttribute('data-tripid');
    location.href = `/planner?trip_id=${tripId}`;
}



document.getElementById('savedtrips-edit-button').addEventListener('click', editTripClickHandler);