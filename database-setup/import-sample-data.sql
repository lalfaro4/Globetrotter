INSERT INTO GlobetrotterV1.`user`(user_id, email) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', 'support@globetrotter.com');
INSERT INTO GlobetrotterV1.`user`(user_id, email) VALUES ('c6e8c312-e752-11eb-bb81-28d24427a5d8', 'help@sfsu.edu');
INSERT INTO GlobetrotterV1.location(location_id, location_name, city, state, country, postal_code, latitude, longitude) VALUES ('1', 'San Francisco State University', 'San Francisco', 'CA', 'US', '94132', 37.7247837, -122.4800585);
INSERT INTO GlobetrotterV1.registered_user(`user`, username, password_hashed, preferred_currency, primary_phone_country_code, primary_phone_number, secondary_phone_country_code, secondary_phone_number) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', 'globetrotter', '$2b$10$4TF8lwcJBfFW.tgew44ubOfQQCR7oZNxAg.UJXI.zwgdW5xMZd6US', 'USD', '1', '4153381111', '1', '9999999999');
INSERT INTO GlobetrotterV1.trip(owner, trip_id, trip_name) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'Best Trip Ever');

# Get location_id for LAX and SFO, and create an activity from LAX to SFO
SELECT location_id INTO @src_id FROM airport_view WHERE iata_code = 'LAX';
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'SFO';
INSERT INTO GlobetrotterV1.activity(trip_owner, trip, activity_id, start_time, end_time, start_location, end_location) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'f9c383b8-e752-11eb-bb81-28d24427a5d8', '2021-07-17 16:02:28', '2021-07-24 16:02:28', @src_id, @dst_id);

 #Get location_id for JFK, and create an activity from SFO to JFK
SET @src_id = @dst_id;
SELECT location_id INTO @dst_id FROM airport_view WHERE iata_code = 'JFK';
INSERT INTO GlobetrotterV1.activity(trip_owner, trip, activity_id, start_time, end_time, start_location, end_location) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'a37c8a8c-e793-11eb-bb81-28d24427a5d8', '2021-07-24 20:02:28', '2021-07-25 06:30:59', @src_id, @dst_id);

INSERT INTO GlobetrotterV1.`file`(owner, file_id, folder_path, file_name, extension, full_file_path) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '2dfc85b7-e744-11eb-bb81-28d24427a5d8', '/public/img/profile/', '4f4e44f7-e730-11eb-bb81-28d24427a5d8', 'jpg', '/public/img/profile/4f4e44f7-e730-11eb-bb81-28d24427a5d8.jpg');
INSERT INTO GlobetrotterV1.photo_album(photo_album_id, trip_owner, trip) VALUES ('516511', '4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8');
INSERT INTO GlobetrotterV1.photo(file_owner, `file`, photo_id, title, description, is_profile_photo) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '2dfc85b7-e744-11eb-bb81-28d24427a5d8', '8562b5ab-e745-11eb-bb81-28d24427a5d8', 'Globetrotter Profile', 'This is my profile photo.', 1);
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('AFN', 'Afghani');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('ALL', 'Lek');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('USD', 'US Dollar');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('EUR', 'Euro');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('AUD', 'Australian Dollar');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('CNY', 'Yuan Renminbi');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('HKD', 'Hong Kong Dollar');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('INR', 'Indian Rupee');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('JPY', 'Yen');
INSERT INTO GlobetrotterV1.currency_code(code, name) VALUES ('GBP', 'Pound Sterling');
INSERT INTO GlobetrotterV1.guest_to_trip_association(trip_owner, trip, guest) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'c6e8c312-e752-11eb-bb81-28d24427a5d8');
INSERT INTO GlobetrotterV1.flight_activity(trip_owner, trip, activity, flight_offer_json_data) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'f9c383b8-e752-11eb-bb81-28d24427a5d8', '{"type":"flight-offer","id":"2","source":"GDS","instantTicketingRequired":false,"nonHomogeneous":false,"oneWay":false,"lastTicketingDate":"2021-07-18","numberOfBookableSeats":1,"itineraries":[{"duration":"PT5H","segments":[{"departure":{"iataCode":"SFO","terminal":"2","at":"2021-08-04T09:00:00"},"arrival":{"iataCode":"LAX","terminal":"6","at":"2021-08-04T10:40:00"},"carrierCode":"AS","number":"3446","aircraft":{"code":"E75"},"duration":"PT1H40M","id":"1","numberOfStops":0,"blacklistedInEU":false},{"departure":{"iataCode":"LAX","terminal":"6","at":"2021-08-04T12:40:00"},"arrival":{"iataCode":"SJC","terminal":"B","at":"2021-08-04T14:00:00"},"carrierCode":"AS","number":"3364","aircraft":{"code":"E75"},"duration":"PT1H20M","id":"2","numberOfStops":0,"blacklistedInEU":false}]}],"price":{"currency":"USD","total":"181.19","base":"146.97","fees":[{"amount":"0.00","type":"SUPPLIER"},{"amount":"0.00","type":"TICKETING"}],"grandTotal":"181.19"},"pricingOptions":{"fareType":["PUBLISHED"],"includedCheckedBagsOnly":false},"validatingAirlineCodes":["AS"],"travelerPricings":[{"travelerId":"1","fareOption":"STANDARD","travelerType":"ADULT","price":{"currency":"USD","total":"181.19","base":"146.97"},"fareDetailsBySegment":[{"segmentId":"1","cabin":"ECONOMY","fareBasis":"OH4OAVMN","brandedFare":"MA","class":"O","includedCheckedBags":{"quantity":0}},{"segmentId":"2","cabin":"ECONOMY","fareBasis":"NH4OAVMN","brandedFare":"MA","class":"N","includedCheckedBags":{"quantity":0}}]}]}');