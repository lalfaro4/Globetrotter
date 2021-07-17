
# Get all Airlines
#SELECT * FROM service_provider INNER JOIN airline ON service_provider.service_provider_id = airline.service_provider;

# Search Airports
#SELECT * FROM location INNER JOIN airport ON location.location_id = airport.location WHERE location.location_name LIKE '%Los An%';

# Create a Trip and Activity
DELIMITER /
DROP PROCEDURE IF EXISTS create_trip/
CREATE PROCEDURE create_trip() 
BEGIN
	SELECT `user` INTO @owner_id FROM registered_user WHERE registered_user.username = 'globetrotter';
	CALL usp_create_trip(@owner_id, 'San Francisco Trip');
	SELECT trip_id INTO @trip_id FROM trip WHERE trip.trip_name = 'San Francisco Trip';
	CALL usp_create_activity(@owner_id, @trip_id, now(), date_add(now(), interval 7 day), 1, 1, NULL);
END /
DELIMITER ;



# Get all Activities grouped by Trip
DELIMITER /
DROP PROCEDURE IF EXISTS get_trip_activities/
CREATE PROCEDURE get_trip_activities()
BEGIN
	SELECT trip_id, trip_name, username, activity_id, start_time, end_time, start_location, end_location FROM activity INNER JOIN trip ON activity.trip = trip.trip_id INNER JOIN registered_user ON trip.`owner` = registered_user.user;
END /
DELIMITER ;



# Delete a Trip (and all it's Activities)
DELIMITER /
DROP PROCEDURE IF EXISTS delete_trip/
CREATE PROCEDURE delete_trip()
BEGIN
	DECLARE v_trip_id VARCHAR(255);
	SELECT trip_id INTO @trip_id FROM trip WHERE trip.trip_name = 'San Francisco Trip';
	DELETE FROM trip WHERE trip.trip_id = @trip_id;
END /
DELIMITER ;



#CALL create_trip();
#CALL delete_trip();
CALL get_trip_activities();