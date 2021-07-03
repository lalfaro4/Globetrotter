const MySQLStore = require("express-mysql-session");
const mysql = require("mysql");

var mysqlOptions = {
    host: '172.93.54.146',
    user: 'team2',
    password: 'YE2n4qh4wV',
    database: 'GlobetrotterV1'
};

// var sessionConnection = mysql.createConnection(mysqlOptions);

// var sessionStore = new MySQLStore({
//     expiration: 999,
//     createDatabaseTable: true,
//     schema: {
//         tableName: 'UserSessions',
//         columnNames: {
//             session_id: 'session_id',
//             expires: 'expires',
//             data: 'data'
//         }
//     }
// }, sessionConnection);

(function (exports) {

    function getSessionStore() {
        //return sessionStore;
    }

    function authenticate() {
        
    }

    function createUser(user) {

    }

    exports.getSessionStore = getSessionStore;

})(typeof exports === 'undefined' ? this['databaseModule'] = {} : exports);