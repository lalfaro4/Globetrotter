const User = require('../../model/User');
var colors = require('colors');
var mysql = require("mysql-await");
var session = require('express-session');
var MySQLStore = require("express-mysql-session")(session);
var bcrypt = require('bcrypt');
const e = require('express');



/*************************************************************************************
 * Global variables
 *************************************************************************************/
var pool;
var sessionConnection;
var sessionStore;



/*************************************************************************************
 * Logging function for database.js
 *************************************************************************************/
function log(message, type) {
    if (type == 'success') {
        console.log(`database.js:: ${message}`.bgBlue.white);
    } else if (type == 'info') {
        console.log(`database.js:: ${message}`.bgBlue.white);
    } else if (type == 'fail') {
        console.log(`database.js:: ${message}`.italic.bgRed.black);
    }
}



/*************************************************************************************
 * MySQL Configuration
 *************************************************************************************/
var options = {
    //host: '172.93.54.146',
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'team2',
    password: 'YE2n4qh4wV',
    database: 'GlobetrotterV1',
    multipleStatements: true
};



/*************************************************************************************
* Anonymous async function for setting up the conections to MySQL
* - Sets up MySQL connection pool
* - Obtains a connection for the session manager
* - Sets up the usersessions table in the database
*************************************************************************************/
(async () => {

    /*************************************************************************************
     * Create a pool of MySQL connections that can be reused.
     *************************************************************************************/
    try {
        pool = await mysql.createPool(options);
        log("Created MySQL connection pool", "success");

        /*************************************************************************************
        * Create one connection just for the session manager.
        *************************************************************************************/
        try {
            sessionConnection = await pool.awaitGetConnection();
            log("Created MySQL session manager connection", "success");

            /*************************************************************************************
            * Create the 'usersessions' table in the database.
            *************************************************************************************/
            try {
                var sessionStore = new MySQLStore({
                    expiration: 999,
                    createDatabaseTable: true,
                    schema: {
                        tableName: 'userSessions',
                        columnNames: {
                            session_id: 'session_id',
                            expires: 'expires',
                            data: 'data'
                        }
                    }
                }, sessionConnection);
                log("Created MySQL session store in database", "success");
            } catch (error) {
                log(`MySQL Error: ${error.code}`, "fail");
                log("Could not create MySQLStore. Database connection probably doesn't exist.", "fail");
            }
        } catch (error) {
            log(`MySQL Error: ${error.code}`, "fail");
            log("Error getting MySQL connection for session manager", "fail");
        }
    } catch (error) {
        log(`MySQL Error: ${error.code}`, "fail");
        log("Error creating MySQL connection pool", "fail");
    }

})();



/*************************************************************************************
 * Returns the sessionStore so that the express-session/express-session-mysql can be 
 * configured in app.js.
 *************************************************************************************/
function getSessionStore() {
    return sessionStore;
}



/*************************************************************************************
 * Generic function for running a query against the MySQL database.
 *************************************************************************************/
async function runQuery(query, params) {
    log(`MySQL Query: ${query}, Params: ${params}`, "success");
    var result = null;
    var connection;
    try {
        connection = await pool.awaitGetConnection({
            multipleStatements: true
        });
        result = await connection.awaitQuery(query, params);
        connection.release();
        log(`MySQL: Found ${result.length} result(s).`, "success");
        return result;
    } catch (error) {
        log(`MySQL Error: ${error.code}`, "fail");
        log(`Message: ${error.sqlMessage}`, "fail");
        log(`SQL: ${error.sql}`, "fail");
    }
}



/*************************************************************************************
 * Create a user in the database (all fields)
 *************************************************************************************/
async function createUser(email, username, password, firstName, lastName, birthday, gender,
    preferredCurrency, homeLocationAddressLine1, homeLocationAddressLine2,
    homeLocationCity, homeLocationState, homeLocationCountry, homeLocationPostalCode,
    primaryPhoneCountryCode, primaryPhoneNumber) {
    var passwordHash = await bcrypt.hash(password, 10);
    var query = 'CALL usp_register_user(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @user_id);';
    var params = [email, username, passwordHash, firstName, lastName, birthday, gender,
        preferredCurrency, homeLocationAddressLine1, homeLocationAddressLine2,
        homeLocationCity, homeLocationState, homeLocationCountry, homeLocationPostalCode,
        primaryPhoneCountryCode, primaryPhoneNumber];
    var result = await runQuery(query, params);
    return result;
}



/*************************************************************************************
 * Create an activity in the database.
 *************************************************************************************/
 async function createFlightActivity(tripOwner, tripId, startTime, endTime, startLocation, endLocation, flightOfferJSONData) {
    var query = 'CALL usp_create_flight_activity(?, ?, ?, ?, ?, ?, ?, @activityId);';
    var params = [tripOwner, tripId, startTime, endTime, startLocation, endLocation, flightOfferJSONData];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Update a flight_activity in the database.
 *************************************************************************************/
 async function updateFlightActivity(activityId, startTime, endTime, startLocation, endLocation, flightOfferJSONData) {
    var query = 'CALL usp_update_flight_activity(?, ?, ?, ?, ?, ?);';
    var params = [activityId, startTime, endTime, startLocation, endLocation, flightOfferJSONData];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Delete an activity from the database.
 *************************************************************************************/
 async function deleteActivity(activityId) {
    var query = 'CALL usp_delete_activity(?);';
    var params = [activityId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get all users from the database.
 *************************************************************************************/
async function getAllUsers() {
    var query = 'SELECT * FROM GlobetrotterV1.registered_user';
    var params = [];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Search for users with a username containing the searchString.
 *************************************************************************************/
async function searchUsersByUsername(searchString) {
    var query = `SELECT * FROM GlobetrotterV1.registered_user WHERE username LIKE '%${searchString}%'`;
    var params = [];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Search for users with an email containing the searchString.
 *************************************************************************************/
async function searchUsersByEmail(searchString) {
    var query = `SELECT * FROM GlobetrotterV1.registered_user WHERE email LIKE '%${searchString}%'`;
    var params = [];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }

}



/*************************************************************************************
 * Get a user by their username from the database.
 *************************************************************************************/
async function getUserByUsername(username) {
    var query = 'SELECT * FROM registered_user_view WHERE username = ? LIMIT 1';
    var params = [username];
    var result = await runQuery(query, params);
    if (result) {
        return result[0];
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get a user by their email from the database.
 *************************************************************************************/
 async function getUserByEmail(username) {
    var query = 'SELECT * FROM `user` WHERE email = ? LIMIT 1';
    var params = [username];
    var result = await runQuery(query, params);
    if (result) {
        return result[0];
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get all trips from the database.
 *************************************************************************************/
async function getAllTrips() {
    var query = 'SELECT * FROM GlobetrotterV1.trip';
    var params = [];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get trips from database by user_id.
 *************************************************************************************/
async function getTripsByOwner(user_id) {
    var query = 'SELECT owner, trip_id, trip_name, photo_album_id FROM trip INNER JOIN photo_album ON trip = trip_id WHERE owner = ?';
    var params = [user_id];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get photo album from database by trip_id.
 *************************************************************************************/
 async function getPhotoAlbumForTrip(tripId) {
    var query = 'SELECT * FROM photo_album WHERE trip = ?';
    var params = [tripId];
    var result = await runQuery(query, params);
    if (result) {
        return result[0];
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get saved trips from database by user_id.
 *************************************************************************************/
async function getSavedTripsByOwner(user_id) {
    var query = 'SELECT * FROM saved_trip_view WHERE owner = ?';
    var params = [user_id];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get trip from database by trip_id.
 *************************************************************************************/
async function getActivitiesByTripId(tripId) {
    var query = 'SELECT * FROM activity_view WHERE trip_id = ?';
    var params = [tripId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get flight_activities from database by trip_id.
 *************************************************************************************/
async function getFlightActivitiesByTripId(tripId) {
    var query = 'SELECT * FROM flight_activity_view WHERE trip_id = ?';
    var params = [tripId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Add photo to database
 *************************************************************************************/
async function createPhoto(userId, folderPath, fileName, extension, title, description, isProfilePhoto, photoIdOut) {
    var query = 'CALL usp_create_photo(?, ?, ?, ?, ?, ?, ?, @photoIdOut); SELECT @photoIdOut';
    var params = [userId, folderPath, fileName, extension, title, description, isProfilePhoto];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Add photo to photo_album
 *************************************************************************************/
async function addPhotoToAlbum(ownerId, photoId, photoAlbumId) {
    var query = 'INSERT INTO photo_to_photo_album_association (`owner`, photo, photo_album) VALUES (?, ?, ?);';
    var params = [ownerId, photoId, photoAlbumId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Create a new trip
 *************************************************************************************/
 async function createTrip(userId, tripName, tripId, albumId) {
    var query = 'CALL usp_create_trip(?, ?, @tripId, @albumId); SELECT @tripId, @albumId;';
    var params = [userId, tripName];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get photos from database by photo album id.
 *************************************************************************************/
async function getPhotosByPhotoAlbumId(photoAlbumId) {
    var query = 'SELECT * FROM photo_view WHERE photo_album_id = ?';
    var params = [photoAlbumId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}




/*************************************************************************************
 * Get airline from database by IATA
 *************************************************************************************/
async function getAirlineNameFromIATACode(iata_code) {
    var query = 'SELECT * FROM airline_view WHERE airline_code = ?';
    var params = [iata_code];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Get airport from database by IATA code
 *************************************************************************************/
 async function getAirportByIATACode(iataCode) {
    var query = 'SELECT * FROM airport_view WHERE iata_code = ?';
    var params = [iataCode];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Search for airports.
 *************************************************************************************/
async function searchAirportsByName(searchString) {
    var query = `SELECT * FROM airport_view WHERE iata_code LIKE '${searchString}%' UNION ALL SELECT * FROM airport_view WHERE location_name LIKE '%${searchString}%' LIMIT 5`;
    var params = [];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Authenticates a user by username and password.
 *************************************************************************************/
async function authenticate(username, password) {
    var result = await runQuery('SELECT password_hashed FROM registered_user WHERE username = ?;',
        [username]);
    var passwordHash;
    if(result[0]) {
        passwordHash = result[0].password_hashed;
    } else {
        return null;
    }

    var user;
    if (result[0]) {
        try {
            var passwordsMatched = await bcrypt.compare(password, passwordHash);
            if (passwordsMatched) {
                user = await getUserByUsername(username);
                user.password_hashed = "";
                return user;
            }
        } catch (error) {
            console.log(`bcrypt Error: ${error.toString()}`.bgRed.black);
        }
    } else {
        return null;
    }
}

/*************************************************************************************
 * Get invited users from database by photo_album_id.
 *************************************************************************************/
async function getInvitedPhotoAlbumUsers(photo_album_id) {
    var query = 'SELECT * FROM invited_users_to_photo_album_view WHERE photo_album_id = ?';
    var params = [photo_album_id];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}

/*************************************************************************************
 * Invite a user to collaborate on a photo_album using their username and photo_album_id.
 *************************************************************************************/
async function inviteUserToPhotoAlbum(username, photoAlbumId) {
    var query = 'CALL usp_invite_to_photo_album(?, ?)';
    var params = [username, photoAlbumId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}


/*************************************************************************************
 * Get albums shared with a user by their userId
 *************************************************************************************/
 async function getAlbumsSharedWithUser(userId) {
    var query = 'SELECT trip_name, registered_user.username AS sharer, photo_album FROM invited_users_to_photo_album_view INNER JOIN trip ON trip.trip_id = trip INNER JOIN registered_user ON trip_owner = registered_user.user WHERE invited_user = ?';
    var params = [userId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Uninvite a user to collaborate on a photo_album using their username and photo_album_id.
 *************************************************************************************/
 async function uninviteUserFromPhotoAlbum(photoAlbumId, userId) {
    var query = 'DELETE FROM invited_user_to_photo_album_association WHERE photo_album = ? AND invited_user = ?';
    var params = [photoAlbumId, userId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}


/*************************************************************************************
 * Update User Password when requesting to reset their password with their username, email, and new password
 *************************************************************************************/
async function resetUserPassword(username, email, newPassword) {
    var newPasswordHash = await bcrypt.hash(newPassword, 10);
    var query = 'Call usp_update_user_password(?, ?, ?)';
    var params = [username, email, newPasswordHash];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }
}



/*************************************************************************************
 * Update User information from the account management page
 *************************************************************************************/
async function updateUserProfile(userId, username, firstName, lastName, gender, birthday, addressLine1, addressLine2,
    city, state, postalCode, primaryPhoneCountryCode, primaryPhoneNumber, secondaryPhoneCountryCode, secondaryPhoneNumber) {
    var query = `CALL usp_update_user_information(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    var params = [userId, username, firstName, lastName, gender, birthday, addressLine1, addressLine2, city, state, postalCode,
        primaryPhoneCountryCode, primaryPhoneNumber, secondaryPhoneCountryCode, secondaryPhoneNumber];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }

}



/*************************************************************************************
 * Update Trip
 *************************************************************************************/
 async function updateTrip(tripId, tripName) {
    var query = `UPDATE trip SET trip_name = ? WHERE trip_id = ?;`;
    var params = [tripName, tripId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }

}


/*************************************************************************************
 * Delete Trip
 *************************************************************************************/
 async function deleteTrip(tripId) {
    var query = `DELETE FROM trip WHERE trip_id = ?;`;
    var params = [tripId];
    var result = await runQuery(query, params);
    if (result) {
        return result;
    } else {
        return null;
    }

}



/*************************************************************************************
 * Make the functions usable from other modules.
 *************************************************************************************/

module.exports.authenticate = authenticate;
module.exports.addPhotoToAlbum = addPhotoToAlbum;
module.exports.createFlightActivity = createFlightActivity;
module.exports.createPhoto = createPhoto;
module.exports.createTrip = createTrip;
module.exports.createUser = createUser;
module.exports.deleteActivity = deleteActivity;
module.exports.deleteTrip = deleteTrip;
module.exports.getActivitiesByTripId = getActivitiesByTripId;
module.exports.getAirlineNameFromIATACode = getAirlineNameFromIATACode;
module.exports.getAirportByIATACode = getAirportByIATACode;
module.exports.getAllUsers = getAllUsers;
module.exports.getAllTrips = getAllTrips;
module.exports.getFlightActivitiesByTripId = getFlightActivitiesByTripId;
module.exports.getInvitedPhotoAlbumUsers = getInvitedPhotoAlbumUsers;
module.exports.getPhotoAlbumForTrip = getPhotoAlbumForTrip;
module.exports.getPhotosByPhotoAlbumId = getPhotosByPhotoAlbumId;
module.exports.getSessionStore = getSessionStore;
module.exports.getSavedTripsByOwner = getSavedTripsByOwner;
module.exports.getAlbumsSharedWithUser = getAlbumsSharedWithUser;
module.exports.getTripsByOwner = getTripsByOwner;
module.exports.getUserByEmail = getUserByEmail;
module.exports.getUserByUsername = getUserByUsername;
module.exports.inviteUserToPhotoAlbum = inviteUserToPhotoAlbum;
module.exports.resetUserPassword = resetUserPassword;
module.exports.runQuery = runQuery;
module.exports.searchAirportsByName = searchAirportsByName;
module.exports.searchUsersByEmail = searchUsersByEmail;
module.exports.searchUsersByUsername = searchUsersByUsername;
module.exports.uninviteUserFromPhotoAlbum = uninviteUserFromPhotoAlbum;
module.exports.updateFlightActivity = updateFlightActivity;
module.exports.updateUserProfile = updateUserProfile;
module.exports.updateTrip = updateTrip;









