# Some of these procedures need to be migrated into the MySQL model as Stored Procedures.


# This might not need to be migrated since I don't know if it returns anything and I haven't tested.
# Get a Registered User's profile photo
DELIMITER /
DROP PROCEDURE IF EXISTS get_profile_photo/
CREATE PROCEDURE get_profile_photo()
BEGIN
    SELECT `user` INTO @owner_id FROM registered_user WHERE registered_user.username = 'globetrotter';
	SELECT file_owner, full_file_path FROM photo INNER JOIN file ON photo.file = file.file_id WHERE photo.file_owner = @owner_id AND photo.is_profile_photo = TRUE;
END /
DELIMITER ;

# Create a review
DELIMITER /
DROP PROCEDURE IF EXISTS create_review/
CREATE PROCEDURE create_review() 
BEGIN
	SELECT `user` INTO @owner_id FROM registered_user WHERE registered_user.username = 'globetrotter';
	SELECT service_provider_id INTO @service_provider_id FROM service_provider WHERE service_provider.service_provider_name = 'Titan Airways';
    CALL usp_create_review(@owner_id, 'Great flight!', @service_provider_id);

	#CALL usp_create_activity(@owner_id, @trip_id, now(), date_add(now(), interval 7 day), 1, 1, NULL);
END /
DELIMITER ;

DELIMITER /
DROP PROCEDURE IF EXISTS delete_review/
CREATE PROCEDURE delete_review()
BEGIN
	DELETE FROM review WHERE reviewer = '4f4e44f7-e730-11eb-bb81-28d24427a5d8';
	#SELECT reviewer INTO @reviewer_id FROM review WHERE review.reviewer = '4f4e44f7-e730-11eb-bb81-28d24427a5d8';
	#DELETE FROM review WHERE review.review_id = @review_id;
END /
DELIMITER ;

# Get all Reviews grouped by Service_Provider
DELIMITER /
DROP PROCEDURE IF EXISTS get_service_provider_reviews/
CREATE PROCEDURE get_service_provider_reviews()
BEGIN
	    SELECT * FROM review;
        #SELECT reviewer, service_provider FROM review;
END /
DELIMITER ;

#CALL create_trip();
#CALL delete_trip();
#CALL get_trip_activities();
#CALL get_profile_photo();

CALL create_review();
#CALL get_service_provider_reviews();
#CALL delete_review();

