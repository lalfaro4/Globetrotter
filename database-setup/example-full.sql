# Clean up any previous users, trips and activities. The delete cascades are not working apparently.
DELETE FROM `user` WHERE user_id IS NOT NULL;
DELETE FROM registered_user WHERE `user` IS NOT NULL;
DELETE FROM home_location WHERE `user` IS NOT NULL;
DELETE FROM trip WHERE trip_id IS NOT NULL;
DELETE FROM activity WHERE activity_id IS NOT NULL;

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

# 1) Create an unregistered user
CALL usp_create_user(@user_email, @user_id);

# 2) Register the unregistered user
CALL usp_register_user(@user_email, @user_username, @user_password_hashed, @user_first_name, @user_last_name, @user_birthday, @user_gender, @user_preferred_currency, 
	@user_home_location_address_line_1, @user_home_location_address_line_2, @user_home_location_city, @user_home_location_state, @user_home_location_country, @user_home_location_postal_code,
    @user_primary_phone_country_code, @user_primary_phone_number, @user_id);

# 4) Start creating the best trip ever
SET @trip_name = "Best Trip Ever (2021)";
CALL usp_create_trip(@user_id, @trip_name, @trip_id);

# 5) Create an activity from Los Angeles to San Francisco, starting 1 month from now with a duration of 1 hour and 25 minutes
SELECT location_id INTO @src_id FROM airport_view WHERE iata_code = 'LAX';
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'SFO';
SET @departure = DATE_ADD(NOW(), INTERVAL 1 MONTH);
SET @arrival = DATE_ADD(@departure, INTERVAL '1:25' HOUR_MINUTE);
CALL usp_create_flight_activity(@user_id, @trip_id, @departure, @arrival, @src_id, @dst_id, "{}", @activity_id);

# 6) Create an activity from San Francisco to New York City, starting at 6AM on the day after arriving in San Francisco, and a duration of 5 hours and 45 minutes.
SET @src_id = @dst_id;
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'JFK';
SET @departure = DATE_ADD(TIMESTAMP(DATE(@departure)), INTERVAL '1:6' DAY_HOUR);
SET @arrival = DATE_ADD(@departure, INTERVAL '5:45' HOUR_MINUTE);
CALL usp_create_flight_activity(@user_id, @trip_id, @departure, @arrival, @src_id, @dst_id, "{}", @activity_id);

# 7) Create an activity from New York City to Rome, departing 1 hour after arriving in New York City and lasting 8 hours and 30 minutes.
SET @src_id = @dst_id;
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'FCO';
SET @departure = DATE_ADD(@arrival, INTERVAL 1 HOUR);
SET @arrival = DATE_ADD(@departure, INTERVAL '8:30' HOUR_MINUTE);
CALL usp_create_flight_activity(@user_id, @trip_id, @departure, @arrival, @src_id, @dst_id, "{}", @activity_id);
