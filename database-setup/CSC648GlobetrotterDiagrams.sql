CREATE TABLE GlobetrotterV1.Activity (
  activity_id     int(10) NOT NULL AUTO_INCREMENT, 
  start_time      int(10) NOT NULL, 
  end_time        int(10) NOT NULL, 
  trip            int(10) NOT NULL, 
  start_location  int(10) NOT NULL, 
  end_location    int(10), 
  serviceprovider int(10), 
  CONSTRAINT activity_id 
    PRIMARY KEY (activity_id));
CREATE TABLE GlobetrotterV1.ServiceProvider (
  serviceprovider_id   int(10) NOT NULL AUTO_INCREMENT, 
  serviceprovider_name varchar(255) NOT NULL, 
  location             int(10), 
  CONSTRAINT service_provider_id 
    PRIMARY KEY (serviceprovider_id));
CREATE TABLE GlobetrotterV1.ServiceRecord (
  servicerecord_id int(10) NOT NULL AUTO_INCREMENT, 
  jsonData         varchar(510), 
  activity         int(10) NOT NULL, 
  serviceprovider  int(10) NOT NULL, 
  CONSTRAINT servicerecord_id 
    PRIMARY KEY (servicerecord_id));
CREATE TABLE GlobetrotterV1.Review (
  review_id       int(10) NOT NULL AUTO_INCREMENT, 
  content         varchar(255) NOT NULL, 
  uuid            binary(16) NOT NULL UNIQUE, 
  reviewer        int(10) NOT NULL, 
  serviceprovider int(10) NOT NULL, 
  PRIMARY KEY (review_id));
CREATE TABLE GlobetrotterV1.RegisteredUser (
  registereduser_id            int(10) NOT NULL AUTO_INCREMENT, 
  username                     varchar(255) NOT NULL UNIQUE, 
  password_hashed              varchar(255) NOT NULL, 
  preferred_currency           varchar(3), 
  primary_phone_country_code   int(10), 
  primary_phone_number         int(10), 
  secondary_phone_country_code int(10), 
  secondary_phone_number       int(10), 
  profile_photo                int(10) UNIQUE, 
  `user`                       int(10) NOT NULL UNIQUE, 
  home_location                int(10) NOT NULL, 
  CONSTRAINT registereduser_id 
    PRIMARY KEY (registereduser_id));
CREATE TABLE GlobetrotterV1.Trip (
  trip_id    int(10) NOT NULL AUTO_INCREMENT, 
  trip_name  varchar(255), 
  owner      int(10) NOT NULL, 
  photoalbum int(10) NOT NULL, 
  PRIMARY KEY (trip_id));
CREATE TABLE GlobetrotterV1.`File` (
  file_id        int(10) NOT NULL AUTO_INCREMENT, 
  owner          int(10) NOT NULL, 
  created        timestamp NOT NULL, 
  folder_path    varchar(255) NOT NULL, 
  file_name      varchar(255) NOT NULL, 
  extension      varchar(5), 
  full_file_path varchar(255) NOT NULL UNIQUE, 
  CONSTRAINT file_id 
    PRIMARY KEY (file_id));
CREATE TABLE GlobetrotterV1.Photo (
  photo_id    int(10) NOT NULL AUTO_INCREMENT, 
  title       varchar(255) NOT NULL, 
  description varchar(255) NOT NULL, 
  `file`      int(10) NOT NULL, 
  CONSTRAINT photo_id 
    PRIMARY KEY (photo_id));
CREATE TABLE GlobetrotterV1.`User` (
  user_id int(10) NOT NULL AUTO_INCREMENT, 
  email   varchar(255) NOT NULL UNIQUE, 
  CONSTRAINT user_id 
    PRIMARY KEY (user_id));
CREATE TABLE GlobetrotterV1.PhotoAlbum (
  photoalbum_id int(10) NOT NULL AUTO_INCREMENT, 
  owner         int(10) NOT NULL, 
  PRIMARY KEY (photoalbum_id));
CREATE TABLE GlobetrotterV1.CurrencyCode (
  code varchar(3) NOT NULL, 
  name varchar(255) NOT NULL, 
  PRIMARY KEY (code));
CREATE TABLE GuestToTripAssociation (
  trip   int(10) NOT NULL, 
  `user` int(10) NOT NULL, 
  PRIMARY KEY (trip, 
  `user`));
CREATE TABLE GlobetrotterV1.Location (
  location_id   int(10) NOT NULL AUTO_INCREMENT, 
  location_name varchar(255), 
  city          varchar(255), 
  state         varchar(255), 
  country       varchar(255), 
  postal_code   varchar(255), 
  latitude      decimal(10, 7), 
  longitude     decimal(10, 7), 
  PRIMARY KEY (location_id));
CREATE TABLE PhotoToAlbumAssociation (
  photo      int(10) NOT NULL, 
  photoalbum int(10) NOT NULL, 
  PRIMARY KEY (photo, 
  photoalbum));
CREATE TABLE GlobetrotterV1.Airline (
  airline_code    varchar(7) NOT NULL, 
  serviceprovider int(10) NOT NULL, 
  PRIMARY KEY (airline_code));
CREATE TABLE GlobetrotterV1.Airport (
  iata_code varchar(3) NOT NULL, 
  location  int(10) NOT NULL, 
  PRIMARY KEY (iata_code));
CREATE TABLE GlobetrotterV1.FlightActivity (
  activity int(10) NOT NULL);
ALTER TABLE GlobetrotterV1.Activity ADD CONSTRAINT FKActivity198912 FOREIGN KEY (trip) REFERENCES GlobetrotterV1.Trip (trip_id);
ALTER TABLE GlobetrotterV1.Review ADD CONSTRAINT FKReview543901 FOREIGN KEY (serviceprovider) REFERENCES GlobetrotterV1.ServiceProvider (serviceprovider_id);
ALTER TABLE GlobetrotterV1.RegisteredUser ADD CONSTRAINT FKRegistered720503 FOREIGN KEY (profile_photo) REFERENCES GlobetrotterV1.Photo (photo_id);
ALTER TABLE GlobetrotterV1.`File` ADD CONSTRAINT FKFile38934 FOREIGN KEY (owner) REFERENCES GlobetrotterV1.RegisteredUser (registereduser_id);
ALTER TABLE GlobetrotterV1.RegisteredUser ADD CONSTRAINT FKRegistered241682 FOREIGN KEY (`user`) REFERENCES GlobetrotterV1.`User` (user_id) ON UPDATE Cascade ON DELETE Cascade;
ALTER TABLE GlobetrotterV1.Trip ADD CONSTRAINT FKTrip613292 FOREIGN KEY (owner) REFERENCES GlobetrotterV1.RegisteredUser (registereduser_id);
ALTER TABLE GlobetrotterV1.Trip ADD CONSTRAINT FKTrip844727 FOREIGN KEY (photoalbum) REFERENCES GlobetrotterV1.PhotoAlbum (photoalbum_id);
ALTER TABLE GlobetrotterV1.PhotoAlbum ADD CONSTRAINT FKPhotoAlbum701882 FOREIGN KEY (owner) REFERENCES GlobetrotterV1.RegisteredUser (registereduser_id);
ALTER TABLE GlobetrotterV1.Review ADD CONSTRAINT FKReview903858 FOREIGN KEY (reviewer) REFERENCES GlobetrotterV1.RegisteredUser (registereduser_id);
ALTER TABLE GuestToTripAssociation ADD CONSTRAINT FKGuestToTri581148 FOREIGN KEY (trip) REFERENCES GlobetrotterV1.Trip (trip_id);
ALTER TABLE GuestToTripAssociation ADD CONSTRAINT FKGuestToTri20646 FOREIGN KEY (`user`) REFERENCES GlobetrotterV1.`User` (user_id);
ALTER TABLE GlobetrotterV1.RegisteredUser ADD CONSTRAINT FKRegistered811337 FOREIGN KEY (home_location) REFERENCES GlobetrotterV1.Location (location_id);
ALTER TABLE GlobetrotterV1.Activity ADD CONSTRAINT FKActivity936010 FOREIGN KEY (start_location) REFERENCES GlobetrotterV1.Location (location_id);
ALTER TABLE GlobetrotterV1.Activity ADD CONSTRAINT FKActivity63929 FOREIGN KEY (end_location) REFERENCES GlobetrotterV1.Location (location_id);
ALTER TABLE GlobetrotterV1.ServiceProvider ADD CONSTRAINT FKServicePro752160 FOREIGN KEY (location) REFERENCES GlobetrotterV1.Location (location_id);
ALTER TABLE GlobetrotterV1.Activity ADD CONSTRAINT FKActivity384675 FOREIGN KEY (serviceprovider) REFERENCES GlobetrotterV1.ServiceProvider (serviceprovider_id);
ALTER TABLE GlobetrotterV1.ServiceRecord ADD CONSTRAINT FKServiceRec686604 FOREIGN KEY (activity) REFERENCES GlobetrotterV1.Activity (activity_id);
ALTER TABLE PhotoToAlbumAssociation ADD CONSTRAINT FKPhotoToAlb393069 FOREIGN KEY (photo) REFERENCES GlobetrotterV1.Photo (photo_id);
ALTER TABLE PhotoToAlbumAssociation ADD CONSTRAINT FKPhotoToAlb315254 FOREIGN KEY (photoalbum) REFERENCES GlobetrotterV1.PhotoAlbum (photoalbum_id);
ALTER TABLE GlobetrotterV1.ServiceRecord ADD CONSTRAINT FKServiceRec145843 FOREIGN KEY (serviceprovider) REFERENCES GlobetrotterV1.ServiceProvider (serviceprovider_id);
ALTER TABLE GlobetrotterV1.Airline ADD CONSTRAINT FKAirline801635 FOREIGN KEY (serviceprovider) REFERENCES GlobetrotterV1.ServiceProvider (serviceprovider_id);
ALTER TABLE GlobetrotterV1.Airport ADD CONSTRAINT FKAirport70647 FOREIGN KEY (location) REFERENCES GlobetrotterV1.Location (location_id);
ALTER TABLE GlobetrotterV1.FlightActivity ADD CONSTRAINT FKFlightActi545948 FOREIGN KEY (activity) REFERENCES GlobetrotterV1.Activity (activity_id);
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.CreateAirport/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE CreateAirport(
	IN airport_name VARCHAR(255),
	IN municipality VARCHAR(255),
	IN iso_country VARCHAR(2),
	IN iata_code VARCHAR(3),
	IN latitude DECIMAL(10, 7),
	IN longitude DECIMAL(10, 7)
	
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	START TRANSACTION;
		INSERT INTO Location (location_name, city, country, latitude, longitude) VALUES (airport_name, municipality, iso_country, latitude, longitude);
		INSERT INTO Airport (iata_code, location) VALUES (iata_code, LAST_INSERT_ID());
	COMMIT;
END;/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.CreateAirline/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE CreateAirline(
	IN iata_code VARCHAR(7),
	IN airline_name VARCHAR(255)	
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		ROLLBACK;
	END;
	START TRANSACTION;
		INSERT INTO ServiceProvider (serviceprovider_name) VALUES (airline_name);
		INSERT INTO Airline (airline_code, serviceprovider) VALUES (iata_code, LAST_INSERT_ID());
	COMMIT;
END;/
DELIMITER ;
DELIMITER /
DROP PROCEDURE IF EXISTS GlobetrotterV1.DeleteReview/
DELIMITER ;
DELIMITER /
CREATE PROCEDURE DeleteReview(
	IN review_uuid INTEGER(10),
	IN requester_id INTEGER(10)
)
BEGIN
	DELETE FROM Review R
	WHERE R.uuid_id = review_uuid 
	AND R.reviewer_id = requester_id;
END/
DELIMITER ;
DELIMITER /
DROP TRIGGER IF EXISTS GlobetrotterV1.BeforeInsertReview/
DELIMITER ;
DELIMITER /
CREATE TRIGGER before_insert_review
	BEFORE INSERT ON Review
	FOR EACH ROW
	SET new.uuid = unhex(replace(uuid(),'-',''));/
DELIMITER ;
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('AFN', 'Afghani');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('ALL', 'Lek');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('USD', 'US Dollar');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('EUR', 'Euro');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('AUD', 'Australian Dollar');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('CNY', 'Yuan Renminbi');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('HKD', 'Hong Kong Dollar');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('INR', 'Indian Rupee');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('JPY', 'Yen');
INSERT INTO GlobetrotterV1.CurrencyCode(code, name) VALUES ('GBP', 'Pund Sterling');
