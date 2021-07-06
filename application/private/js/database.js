var mysql = require("mysql-await");
var session = require('express-session');
var MySQLStore = require("express-mysql-session")(session);
var bcrypt = require('bcrypt');

var options = {
    //host: '172.93.54.146',
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'team2',
    password: 'YE2n4qh4wV',
    database: 'GlobetrotterV1'
};

var pool = mysql.createPool(options);
var sessionConnection = mysql.createConnection(options);
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

function getSessionStore() {
    return sessionStore;
}

async function runQuery(query, params) {
    var connection = await pool.awaitGetConnection();
    var result = "";
    try {
        result = await connection.awaitQuery(query, params);
    } catch (err) {
        result = `MySQL Error: ${err.code}`;
    }
    connection.release();
    return result;
}

async function createUser(username, password) {
    var passwordHash = await bcrypt.hash(password, 10);
    var query = 'INSERT INTO GlobetrotterV1.users (username, passwordHash) VALUES(?, ?)';
    var params = [username, passwordHash];
    var result = await runQuery(query, params);
    return result;
}

async function getUserByUsername(username) {
    var query = 'SELECT * FROM GlobetrotterV1.users WHERE username = ? LIMIT 1';
    var params = [username];
    var result = await runQuery(query, params);
    return result[0];
}

async function authenticate(username, password) {
    var user = await getUserByUsername(username);
    if (user) {
        var passwordsMatched = await bcrypt.compare(password, user.passwordHash);
        if (passwordsMatched) {
            user.id = "";
            user.passwordHash = "";
            return user;
        }
    }
    return false;
}

module.exports.getSessionStore = getSessionStore;
module.exports.createUser = createUser;
module.exports.getUserByUsername = getUserByUsername;
module.exports.authenticate = authenticate;