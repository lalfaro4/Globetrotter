DELIMITER /
DROP PROCEDURE IF EXISTS search_airline_name/
CREATE PROCEDURE search_airline_name(
	IN p_search_string VARCHAR(255)
) 
BEGIN
	SELECT * FROM service_provider WHERE service_provider.service_provider_name LIKE '%p_search_string%';
END /
DELIMITER ;


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
	SELECT trip_id INTO @trip_id FROM trip WHERE trip.trip_name = 'San Francisco Trip';
	DELETE FROM trip WHERE trip.trip_id = @trip_id;
END /
DELIMITER ;



# Get a Registered User's profile photo
DELIMITER /
DROP PROCEDURE IF EXISTS get_profile_photo/
CREATE PROCEDURE get_profile_photo()
BEGIN
    SELECT `user` INTO @owner_id FROM registered_user WHERE registered_user.username = 'globetrotter';
	SELECT file_owner, full_file_path FROM photo INNER JOIN file ON photo.file = file.file_id WHERE photo.file_owner = @owner_id AND photo.is_profile_photo = TRUE;
END /
DELIMITER ;



#CALL create_trip();
#CALL delete_trip();
#CALL get_trip_activities();
#CALL get_profile_photo();
CALL search_airline_name('merica');