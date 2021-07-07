const User = require('../../model/User');
var mysql = require("mysql-await");
var session = require('express-session');
var MySQLStore = require("express-mysql-session")(session);
var bcrypt = require('bcrypt');



/*************************************************************************************
 * Global variables
 *************************************************************************************/
var pool;
var sessionConnection;
var sessionStore;



/*************************************************************************************
 * MySQL Configuration
 *************************************************************************************/
var options = {
    //host: '172.93.54.146',
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'team2',
    password: 'YE2n4qh4wV',
    database: 'GlobetrotterV1'
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
        pool = mysql.createPool(options);
        console.log("Created MySQL connection pool");

        /*************************************************************************************
        * Create one connection just for the session manager.
        *************************************************************************************/
        try {
            sessionConnection = await pool.awaitGetConnection();
            console.log("Created MySQL session manager connection");

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
                console.log("Created MySQL session store");
            } catch (error) {
                console.log(`MySQL Error: ${error.code}`);
                console.log("Could not create MySQLStore. Database connection probably doesn't exist.");
            }
        } catch (error) {
            console.log(`MySQL Error: ${error.code}`);
            console.log("Error getting MySQL connection for session manager")
        }
    } catch (error) {
        console.log(`MySQL Error: ${error.code}`);
        console.log("Error creating MySQL connection pool");
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
    var result = null;
    var connection;
    try {
        connection = await pool.awaitGetConnection();
        result = await connection.awaitQuery(query, params);
        connection.release();
    } catch (err) {
        console.log(`MySQL Error: ${err.code}`);
    }
    return result;
}



/*************************************************************************************
 * Create a user in the database.
 *************************************************************************************/
async function createUser(username, password) {
    var passwordHash = await bcrypt.hash(password, 10);
    var query = 'INSERT INTO GlobetrotterV1.users (username, passwordHash) VALUES(?, ?)';
    var params = [username, passwordHash];
    var result = await runQuery(query, params);
    return result;
}



/*************************************************************************************
 * Get all users from the database.
 *************************************************************************************/
async function getAllUsers() {
    var query = 'SELECT * FROM GlobetrotterV1.users';
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
    var query = 'SELECT * FROM GlobetrotterV1.users WHERE username = ? LIMIT 1';
    var params = [username];
    var result = await runQuery(query, params);
    if (result) {
        return result[0];
    } else {
        return null;
    }
}



/*************************************************************************************
 * Authenticates a user by username and password.
 *************************************************************************************/
async function authenticate(username, password) {
    var user = await getUserByUsername(username);
    if (user) {
        var passwordsMatched = await bcrypt.compare(password, user.passwordHash);
        if (passwordsMatched) {
            user.id = "";
            user.passwordHash = "";
            return user;
        }
    } else {
        return null;
    }
}



/*************************************************************************************
 * Make the functions usable from other modules.
 *************************************************************************************/
module.exports.getSessionStore = getSessionStore;
module.exports.createUser = createUser;
module.exports.getAllUsers = getAllUsers;
module.exports.getUserByUsername = getUserByUsername;
module.exports.authenticate = authenticate;