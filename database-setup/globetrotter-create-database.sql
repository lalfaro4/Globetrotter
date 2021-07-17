-- -----------------------------------------------------
-- Schema GlobetrotterV1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `GlobetrotterV1` DEFAULT CHARACTER SET utf8 ;
USE `GlobetrotterV1` ;

CREATE TABLE GlobetrotterV1.service_provider (
  service_provider_id   varchar(36) NOT NULL, 
  service_provider_name varchar(255) NOT NULL, 
  location              varchar(36), 
  PRIMARY KEY (service_provider_id));
CREATE TABLE GlobetrotterV1.review (
  reviewer         varchar(36) NOT NULL, 
  service_provider varchar(36) NOT NULL, 
  content          varchar(255) NOT NULL, 
  PRIMARY KEY (reviewer, 
  service_provider));
CREATE TABLE GlobetrotterV1.`file` (
  owner          varchar(36) NOT NULL, 
  file_id        varchar(36) NOT NULL, 
  folder_path    varchar(255) NOT NULL, 
  file_name      varchar(255) NOT NULL, 
  extension      varchar(5), 
  full_file_path varchar(255) NOT NULL UNIQUE, 
  PRIMARY KEY (owner, 
  file_id));
CREATE TABLE GlobetrotterV1.`user` (
  user_id varchar(36) NOT NULL, 
  email   varchar(255) NOT NULL UNIQUE, 
  PRIMARY KEY (user_id));
CREATE TABLE GlobetrotterV1.currency_code (
  code varchar(3) NOT NULL, 
  name varchar(255) NOT NULL, 
  PRIMARY KEY (code));
CREATE TABLE GlobetrotterV1.location (
  location_id   varchar(36) NOT NULL, 
  location_name varchar(255), 
  city          varchar(255), 
  state         varchar(255), 
  country       varchar(255), 
  postal_code   varchar(255), 
  latitude      decimal(10, 7), 
  longitude     decimal(10, 7), 
  PRIMARY KEY (location_id));
CREATE TABLE GlobetrotterV1.airline (
  service_provider varchar(36) NOT NULL UNIQUE, 
  airline_code     varchar(7) NOT NULL UNIQUE, 
  PRIMARY KEY (service_provider, 
  airline_code));
CREATE TABLE GlobetrotterV1.airport (
  location  varchar(36) NOT NULL UNIQUE, 
  iata_code varchar(3) NOT NULL UNIQUE, 
  PRIMARY KEY (location, 
  iata_code));
CREATE TABLE GlobetrotterV1.hotel_activity (
  trip_owner            varchar(36) NOT NULL, 
  trip                  varchar(36) NOT NULL, 
  activity              varchar(36) NOT NULL UNIQUE, 
  hotel_offer_json_data varchar(4095) NOT NULL, 
  PRIMARY KEY (trip_owner, 
  trip, 
  activity));
CREATE TABLE GlobetrotterV1.registered_user (
  `user`                       varchar(36) NOT NULL, 
  username                     varchar(255) NOT NULL UNIQUE, 
  password_hashed              varchar(255) NOT NULL, 
  preferred_currency           varchar(3), 
  primary_phone_country_code   varchar(2), 
  primary_phone_number         varchar(10), 
  secondary_phone_country_code varchar(2), 
  secondary_phone_number       varchar(10), 
  PRIMARY KEY (`user`));
CREATE TABLE GlobetrotterV1.photo_album (
  trip_owner varchar(36) NOT NULL, 
  trip       varchar(36) NOT NULL UNIQUE, 
  PRIMARY KEY (trip_owner, 
  trip));
CREATE TABLE GlobetrotterV1.activity (
  trip_owner     varchar(36) NOT NULL, 
  trip           varchar(36) NOT NULL, 
  activity_id    varchar(36) NOT NULL UNIQUE, 
  start_time     timestamp NOT NULL, 
  end_time       timestamp NOT NULL, 
  start_location varchar(36) NOT NULL, 
  end_location   varchar(36), 
  PRIMARY KEY (trip_owner, 
  trip, 
  activity_id));
CREATE TABLE GlobetrotterV1.guest_to_trip_association (
  trip_owner varchar(36) NOT NULL, 
  trip       varchar(36) NOT NULL, 
  guest      varchar(36) NOT NULL, 
  PRIMARY KEY (trip_owner, 
  trip, 
  guest));
CREATE TABLE GlobetrotterV1.trip (
  owner     varchar(36) NOT NULL, 
  trip_id   varchar(36) NOT NULL UNIQUE, 
  trip_name varchar(255) NOT NULL UNIQUE, 
  PRIMARY KEY (owner, 
  trip_id));
CREATE TABLE GlobetrotterV1.flight_activity (
  trip_owner             varchar(36) NOT NULL, 
  trip                   varchar(36) NOT NULL, 
  activity               varchar(36) NOT NULL UNIQUE, 
  flight_offer_json_data varchar(4095) NOT NULL, 
  PRIMARY KEY (trip_owner, 
  trip, 
  activity));
CREATE TABLE GlobetrotterV1.photo (
  trip_owner       varchar(36) NOT NULL, 
  trip             varchar(36) NOT NULL, 
  file_owner       varchar(36) NOT NULL, 
  `file`           varchar(36) NOT NULL, 
  photo_id         varchar(36) NOT NULL UNIQUE, 
  title            varchar(255) NOT NULL, 
  description      varchar(255) NOT NULL, 
  is_profile_photo bit(1), 
  PRIMARY KEY (trip_owner, 
  trip, 
  file_owner, 
  `file`, 
  photo_id));
CREATE TABLE GlobetrotterV1.home_location (
  `user`   varchar(36) NOT NULL UNIQUE, 
  location varchar(36) NOT NULL, 
  PRIMARY KEY (`user`, 
  location));
CREATE TABLE GlobetrotterV1.service_record (
  trip_owner        varchar(36) NOT NULL, 
  trip              varchar(36) NOT NULL, 
  activity          varchar(36) NOT NULL, 
  service_provider  varchar(36) NOT NULL, 
  service_record_id varchar(36) NOT NULL UNIQUE, 
  json_data         varchar(510), 
  PRIMARY KEY (trip_owner, 
  trip, 
  activity, 
  service_provider, 
  service_record_id));
ALTER TABLE GlobetrotterV1.review ADD CONSTRAINT FKreview587606 FOREIGN KEY (service_provider) REFERENCES GlobetrotterV1.service_provider (service_provider_id);
ALTER TABLE GlobetrotterV1.`file` ADD CONSTRAINT FKfile63262 FOREIGN KEY (owner) REFERENCES GlobetrotterV1.registered_user (`user`) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.registered_user ADD CONSTRAINT FKregistered221452 FOREIGN KEY (`user`) REFERENCES GlobetrotterV1.`user` (user_id);
ALTER TABLE GlobetrotterV1.review ADD CONSTRAINT FKreview785100 FOREIGN KEY (reviewer) REFERENCES GlobetrotterV1.registered_user (`user`) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.activity ADD CONSTRAINT FKactivity647625 FOREIGN KEY (start_location) REFERENCES GlobetrotterV1.location (location_id);
ALTER TABLE GlobetrotterV1.activity ADD CONSTRAINT FKactivity775543 FOREIGN KEY (end_location) REFERENCES GlobetrotterV1.location (location_id);
ALTER TABLE GlobetrotterV1.service_provider ADD CONSTRAINT FKservice_pr758271 FOREIGN KEY (location) REFERENCES GlobetrotterV1.location (location_id);
ALTER TABLE GlobetrotterV1.service_record ADD CONSTRAINT FKservice_re130192 FOREIGN KEY (service_provider) REFERENCES GlobetrotterV1.service_provider (service_provider_id);
ALTER TABLE GlobetrotterV1.airline ADD CONSTRAINT FKairline30762 FOREIGN KEY (service_provider) REFERENCES GlobetrotterV1.service_provider (service_provider_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.airport ADD CONSTRAINT FKairport228490 FOREIGN KEY (location) REFERENCES GlobetrotterV1.location (location_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.photo_album ADD CONSTRAINT FKphoto_albu409387 FOREIGN KEY (trip_owner, trip) REFERENCES GlobetrotterV1.trip (owner, trip_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.home_location ADD CONSTRAINT FKhome_locat943937 FOREIGN KEY (location) REFERENCES GlobetrotterV1.location (location_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.photo ADD CONSTRAINT FKphoto969782 FOREIGN KEY (trip_owner, trip) REFERENCES GlobetrotterV1.photo_album (trip_owner, trip) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.flight_activity ADD CONSTRAINT FKflight_act74694 FOREIGN KEY (trip_owner, trip, activity) REFERENCES GlobetrotterV1.activity (trip_owner, trip, activity_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.hotel_activity ADD CONSTRAINT FKhotel_acti533323 FOREIGN KEY (trip_owner, trip, activity) REFERENCES GlobetrotterV1.activity (trip_owner, trip, activity_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.home_location ADD CONSTRAINT FKhome_locat112639 FOREIGN KEY (`user`) REFERENCES GlobetrotterV1.registered_user (`user`) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.guest_to_trip_association ADD CONSTRAINT FKguest_to_t161724 FOREIGN KEY (trip_owner, trip) REFERENCES GlobetrotterV1.trip (owner, trip_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.guest_to_trip_association ADD CONSTRAINT FKguest_to_t184907 FOREIGN KEY (guest) REFERENCES GlobetrotterV1.`user` (user_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.activity ADD CONSTRAINT FKactivity816498 FOREIGN KEY (trip_owner, trip) REFERENCES GlobetrotterV1.trip (owner, trip_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.service_record ADD CONSTRAINT FKservice_re747461 FOREIGN KEY (trip_owner, trip, activity) REFERENCES GlobetrotterV1.activity (trip_owner, trip, activity_id) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.trip ADD CONSTRAINT FKtrip488903 FOREIGN KEY (owner) REFERENCES GlobetrotterV1.registered_user (`user`) ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.photo ADD CONSTRAINT FKphoto844459 FOREIGN KEY (file_owner, `file`) REFERENCES GlobetrotterV1.`file` (owner, file_id);
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_create_airport/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_create_airport(
	IN p_airport_name VARCHAR(255),
	IN p_city VARCHAR(255),
	IN p_country VARCHAR(2),
	IN p_iata_code VARCHAR(3),
	IN p_latitude DECIMAL(10, 7),
	IN p_longitude DECIMAL(10, 7)	
)
BEGIN
	DECLARE v_uuid VARCHAR(36);
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	START TRANSACTION;
		SELECT uuid() INTO v_uuid;
		INSERT INTO location (location_id, location_name, city, country, latitude, longitude) VALUES (v_uuid, p_airport_name, p_city, p_country, p_latitude, p_longitude);
		INSERT INTO airport (location, iata_code) VALUES (v_uuid, p_iata_code);
	COMMIT;
END;/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_create_airline/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_create_airline(
	IN p_iata_code VARCHAR(7),
	IN p_airline_name VARCHAR(255)	
)
BEGIN
	DECLARE v_uuid VARCHAR(36);
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	START TRANSACTION;
		SELECT uuid() INTO v_uuid;
		INSERT INTO service_provider (service_provider_id, service_provider_name) VALUES (v_uuid, p_airline_name);
		INSERT INTO airline (airline_code, service_provider) VALUES (p_iata_code, v_uuid);
	COMMIT;
END;/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_create_trip/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_create_trip(
	IN p_owner VARCHAR(36),
	IN p_trip_name VARCHAR(255)	
)
BEGIN
	DECLARE v_uuid VARCHAR(36);
	SELECT uuid() INTO v_uuid;
	INSERT INTO trip (owner, trip_id, trip_name) VALUES (p_owner, v_uuid, p_trip_name);
END/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_delete_trip/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_delete_trip(
	IN p_trip_id VARCHAR(36)
)
BEGIN
	DELETE FROM trip WHERE trip.trip_id = p_trip_id;
END/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_create_activity/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_create_activity(
	IN p_trip_owner VARCHAR(36),
	IN p_trip VARCHAR(36),
	IN p_start_time TIMESTAMP,
	IN p_end_time TIMESTAMP,
	IN p_start_location VARCHAR(36),
	IN p_end_location VARCHAR(36),
	IN p_service_provider VARCHAR(36)	
)
BEGIN
	DECLARE v_uuid VARCHAR(36);
	DECLARE v_trip VARCHAR(36);
	SELECT trip_id INTO v_trip FROM trip WHERE trip.trip_id = p_trip;
	SELECT uuid() INTO v_uuid;
	IF ISNULL(v_trip) THEN
		SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'Cannot create activity for trip that does not exist.';
	ELSE
		INSERT INTO activity (trip_owner, trip, activity_id, start_time, end_time, start_location, end_location, service_provider) VALUES (p_trip_owner, p_trip, v_uuid, p_start_time, p_end_time, p_start_location, p_end_location,  p_service_provider);
	END IF;
END/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_delete_activity/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_delete_activity(
	IN p_activity_id VARCHAR(36)
)
BEGIN
	DELETE FROM activity WHERE activity.activity_id = p_activity_id;
END/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_create_review/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_create_review(
	IN p_reviewer VARCHAR(36),
	IN p_review_content VARCHAR(255),
	IN p_service_provider VARCHAR(36)
)
BEGIN
	DECLARE v_uuid VARCHAR(36);
	SELECT uuid() INTO v_uuid;
	INSERT INTO review (reviewer, review_id, content, service_provider) VALUES (p_reviewer, v_uuid, p_review_content, p_service_provider);
END/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.usp_delete_review/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE usp_delete_review(
	IN p_review_id VARCHAR(36)
)
BEGIN
	DELETE FROM review WHERE review.review_id = p_review_id;
END/
DELIMITER ;
INSERT INTO GlobetrotterV1.location(location_id, location_name, city, state, country, postal_code, latitude, longitude) VALUES ('1', 'San Francisco State University', 'San Francisco', 'CA', 'US', '94132', 37.7247837, -122.4800585);
INSERT INTO GlobetrotterV1.`user`(user_id, email) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', 'support@globetrotter.com');
INSERT INTO GlobetrotterV1.`user`(user_id, email) VALUES ('c6e8c312-e752-11eb-bb81-28d24427a5d8', 'help@sfsu.edu');
INSERT INTO GlobetrotterV1.registered_user(`user`, username, password_hashed, preferred_currency, primary_phone_country_code, primary_phone_number, secondary_phone_country_code, secondary_phone_number) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', 'globetrotter', '$2b$10$4TF8lwcJBfFW.tgew44ubOfQQCR7oZNxAg.UJXI.zwgdW5xMZd6US', 'USD', '1', '4153381111', '1', '9999999999');
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
INSERT INTO GlobetrotterV1.trip(owner, trip_id, trip_name) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'Best Trip Ever');
INSERT INTO GlobetrotterV1.`file`(owner, file_id, folder_path, file_name, extension, full_file_path) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '2dfc85b7-e744-11eb-bb81-28d24427a5d8', '/public/img/profile/', '4f4e44f7-e730-11eb-bb81-28d24427a5d8', 'jpg', '/public/img/profile/4f4e44f7-e730-11eb-bb81-28d24427a5d8.jpg');
INSERT INTO GlobetrotterV1.photo_album(trip_owner, trip) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8');
INSERT INTO GlobetrotterV1.activity(trip_owner, trip, activity_id, start_time, end_time, start_location, end_location) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'f9c383b8-e752-11eb-bb81-28d24427a5d8', '2021-07-17 16:02:28', '2021-07-24 16:02:28', '1', '1');
INSERT INTO GlobetrotterV1.guest_to_trip_association(trip_owner, trip, guest) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'c6e8c312-e752-11eb-bb81-28d24427a5d8');
INSERT INTO GlobetrotterV1.flight_activity(trip_owner, trip, activity, flight_offer_json_data) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', 'f9c383b8-e752-11eb-bb81-28d24427a5d8', '{"type":"flight-offer","id":"2","source":"GDS","instantTicketingRequired":false,"nonHomogeneous":false,"oneWay":false,"lastTicketingDate":"2021-07-18","numberOfBookableSeats":1,"itineraries":[{"duration":"PT5H","segments":[{"departure":{"iataCode":"SFO","terminal":"2","at":"2021-08-04T09:00:00"},"arrival":{"iataCode":"LAX","terminal":"6","at":"2021-08-04T10:40:00"},"carrierCode":"AS","number":"3446","aircraft":{"code":"E75"},"duration":"PT1H40M","id":"1","numberOfStops":0,"blacklistedInEU":false},{"departure":{"iataCode":"LAX","terminal":"6","at":"2021-08-04T12:40:00"},"arrival":{"iataCode":"SJC","terminal":"B","at":"2021-08-04T14:00:00"},"carrierCode":"AS","number":"3364","aircraft":{"code":"E75"},"duration":"PT1H20M","id":"2","numberOfStops":0,"blacklistedInEU":false}]}],"price":{"currency":"USD","total":"181.19","base":"146.97","fees":[{"amount":"0.00","type":"SUPPLIER"},{"amount":"0.00","type":"TICKETING"}],"grandTotal":"181.19"},"pricingOptions":{"fareType":["PUBLISHED"],"includedCheckedBagsOnly":false},"validatingAirlineCodes":["AS"],"travelerPricings":[{"travelerId":"1","fareOption":"STANDARD","travelerType":"ADULT","price":{"currency":"USD","total":"181.19","base":"146.97"},"fareDetailsBySegment":[{"segmentId":"1","cabin":"ECONOMY","fareBasis":"OH4OAVMN","brandedFare":"MA","class":"O","includedCheckedBags":{"quantity":0}},{"segmentId":"2","cabin":"ECONOMY","fareBasis":"NH4OAVMN","brandedFare":"MA","class":"N","includedCheckedBags":{"quantity":0}}]}]}');
INSERT INTO GlobetrotterV1.photo(trip_owner, trip, file_owner, `file`, photo_id, title, description, is_profile_photo) VALUES ('4f4e44f7-e730-11eb-bb81-28d24427a5d8', '6f9a7167-e744-11eb-bb81-28d24427a5d8', '4f4e44f7-e730-11eb-bb81-28d24427a5d8', '2dfc85b7-e744-11eb-bb81-28d24427a5d8', '8562b5ab-e745-11eb-bb81-28d24427a5d8', 'Globetrotter Profile', 'This is my profile photo.', 1);

CREATE USER 'team2' IDENTIFIED WITH mysql_native_password BY 'YE2n4qh4wV';
GRANT ALL ON `GlobetrotterV1`.* TO 'team2';