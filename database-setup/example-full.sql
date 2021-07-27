# Clean up any previous users, trips and activities. The delete cascades are not working apparently.
DELETE FROM `user` WHERE user_id IS NOT NULL;
DELETE FROM registered_user WHERE `user` IS NOT NULL;
DELETE FROM home_location WHERE `user` IS NOT NULL;
DELETE FROM trip WHERE trip_id IS NOT NULL;
DELETE FROM activity WHERE activity_id IS NOT NULL;
DELETE FROM photo WHERE photo_id IS NOT NULL;
DELETE FROM file WHERE file_id IS NOT NULL;

# Properties for user 1
SET @user_email = 'support@globetrotter.com';
SET @user_username = 'globetrotter';
SET @user_password_hashed = '$2b$10$4TF8lwcJBfFW.tgew44ubOfQQCR7oZNxAg.UJXI.zwgdW5xMZd6US';
SET @user_first_name = 'Globe';
SET @user_last_name = 'Trotter';
SET @user_birthday = '2000-01-01';
SET @user_gender = 'other';
SET @user_preferred_currency = 'USD';
SET @user_primary_phone_country_code = '1';
SET @user_primary_phone_number = '4153381111';
-- SET @user_secondary_phone_country_code = '1';
-- SET @user_secondary_phone_number = '9999999999';
-- SET @user_home_location_name = 'San Francisco State University';
SET @user_home_location_address_line_1 = '1600 Holloway Ave';
SET @user_home_location_address_line_2 = '';
SET @user_home_location_city = 'San Francisco';
SET @user_home_location_state = 'CA';
SET @user_home_location_country = 'US';
SET @user_home_location_postal_code = '94132';
-- SET @user_home_location_latitude = 37.7247837;
-- SET @user_home_location_longitude = -122.4800585;
SET @trip_photo_title = 'Student Center';
SET @trip_photo_description = 'This is the Cesar Chavez Student Center at SFSU.';
SET @trip_photo_is_profile_photo = FALSE;
SET @trip_photo_folder_path = '/public/images/';
SET @trip_photo_file_name = 'sfsu';
SET @trip_photo_extension = 'jpg';
SET @activity_lax_to_sfo_flight_offer_json_data = '{"type":"flight-offer","id":"1","source":"GDS","instantTicketingRequired":false,"nonHomogeneous":false,"oneWay":false,"lastTicketingDate":"2021-07-27","numberOfBookableSeats":7,"itineraries":[{"duration":"PT1H22M","segments":[{"departure":{"iataCode":"LAX","terminal":"5","at":"2021-08-04T06:00:00"},"arrival":{"iataCode":"SFO","terminal":"1","at":"2021-08-04T07:22:00"},"carrierCode":"B6","number":"2836","aircraft":{"code":"320"},"operating":{"carrierCode":"B6"},"duration":"PT1H22M","id":"1","numberOfStops":0,"blacklistedInEU":false}]}],"price":{"currency":"USD","total":"98.40","base":"78.14","fees":[{"amount":"0.00","type":"SUPPLIER"},{"amount":"0.00","type":"TICKETING"}],"grandTotal":"98.40"},"pricingOptions":{"fareType":["PUBLISHED"],"includedCheckedBagsOnly":false},"validatingAirlineCodes":["B6"],"travelerPricings":[{"travelerId":"1","fareOption":"STANDARD","travelerType":"ADULT","price":{"currency":"USD","total":"98.40","base":"78.14"},"fareDetailsBySegment":[{"segmentId":"1","cabin":"ECONOMY","fareBasis":"ML7AUEL1","brandedFare":"DN","class":"L","includedCheckedBags":{"quantity":0}}]}]}';

# Properties for user 2
SET @user2_email = 'trottingdaglobe@globetrotter.com';
SET @user2_username = 'TrottingDaGlobe';
SET @user2_password_hashed = '$3b$10$4TF8lwcJBfFW.ftqd44ubOfQQCR7oZNxAg.UJXI.zwgdW5xMZd6NA';
SET @user2_first_name = 'Trotting';
SET @user2_last_name = 'DaGlobe';
SET @user2_birthday = '2005-12-12';
SET @user2_gender = 'other';
SET @user2_preferred_currency = 'USD';
SET @user2_primary_phone_country_code = '1';
SET @user2_primary_phone_number = '4153381111';
SET @user2_home_location_address_line_1 = '1600 Holloway Ave';
SET @user2_home_location_address_line_2 = '';
SET @user2_home_location_city = 'San Francisco';
SET @user2_home_location_state = 'CA';
SET @user2_home_location_country = 'US';
SET @user2_home_location_postal_code = '94132';

# 1) Create an unregistered user
CALL usp_create_user(@user_email, @user_id);

# 2) Register the unregistered user
CALL usp_register_user(@user_email, @user_username, @user_password_hashed, @user_first_name, @user_last_name, @user_birthday, @user_gender, @user_preferred_currency, 
	@user_home_location_address_line_1, @user_home_location_address_line_2, @user_home_location_city, @user_home_location_state, @user_home_location_country, @user_home_location_postal_code,
    @user_primary_phone_country_code, @user_primary_phone_number, @user_id);

# 4) Start creating the best trip ever
SET @trip_name = "Best Trip Ever (2021)";
CALL usp_create_trip(@user_id, @trip_name, @trip_id, @album_id);

# 5) Create an activity from Los Angeles to San Francisco, starting 1 month from now with a duration of 1 hour and 25 minutes
SELECT location_id INTO @src_id FROM airport_view WHERE iata_code = 'LAX';
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'SFO';
SET @departure = DATE_ADD(NOW(), INTERVAL 1 MONTH);
SET @arrival = DATE_ADD(@departure, INTERVAL '1:25' HOUR_MINUTE);
CALL usp_create_flight_activity(@user_id, @trip_id, @departure, @arrival, @src_id, @dst_id, @activity_lax_to_sfo_flight_offer_json_data, @activity_id);

# 6) Create an activity from San Francisco to New York City, starting at 6AM on the day after arriving in San Francisco, and a duration of 5 hours and 45 minutes.
SET @src_id = @dst_id;
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'JFK';
SET @departure = DATE_ADD(TIMESTAMP(DATE(@departure)), INTERVAL '1:6' DAY_HOUR);
SET @arrival = DATE_ADD(@departure, INTERVAL '5:45' HOUR_MINUTE);
CALL usp_create_flight_activity(@user_id, @trip_id, @departure, @arrival, @src_id, @dst_id, null, @activity_id);

# 7) Create an activity from New York City to Rome, departing 1 hour after arriving in New York City and lasting 8 hours and 30 minutes.
SET @src_id = @dst_id;
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'FCO';
SET @departure = DATE_ADD(@arrival, INTERVAL 1 HOUR);
SET @arrival = DATE_ADD(@departure, INTERVAL '8:30' HOUR_MINUTE);
CALL usp_create_flight_activity(@user_id, @trip_id, @departure, @arrival, @src_id, @dst_id, null, @activity_id);

# 8) Add a photo to the trip
CALL usp_create_photo(@user_id, @trip_photo_folder_path, @trip_photo_file_name, @trip_photo_extension, @trip_photo_title, @trip_photo_description, false, @photo_id);
CALL usp_add_photo_to_album(@photo_id, @trip_id);

#10) A second user is invited to view Globe Trotter's photo album
CALL usp_create_user(@user2_email, @user2_id);

#11) The invited user registers so that they can view a photo album
-- CALL usp_register_user(@user2_email, @user2_username, @user2_password_hashed, @user2_first_name, @user2_last_name, @user2_birthday, @user2_gender, @user2_preferred_currency, 
-- 	@user2_home_location_address_line_1, @user2_home_location_address_line_2, @user2_home_location_city, @user2_home_location_state, @user2_home_location_country, @user2_home_location_postal_code,
--     @user2_primary_phone_country_code, @user2_primary_phone_number, @user2_id);

#10) Add a registered_user to the invited_user_to_photo_album_association.
-- CALL usp_invite_to_photo_album('TrottingDaGlobe', @album_id);

