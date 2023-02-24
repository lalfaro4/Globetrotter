var jwt = require('jsonwebtoken');



/*************************************************************************************
 * Global variables. Keep private and not exported.
 *************************************************************************************/
const WebTokenPassword = "GlobetrotterToken2021!";  // Password for encrypt/decypt tokens



/*************************************************************************************
 * Utility Funtion: Generates a new encrypted web token
 *************************************************************************************/
function getNewToken(payload) {
    return jwt.sign({ data: payload }, WebTokenPassword);
}



/*************************************************************************************
 * Extracts a web token from a request.
 *************************************************************************************/
function extractToken(req) {
    var authorizationHeaders = req.headers.authorization;
    if (authorizationHeaders) {
        var [type, token] = authorizationHeaders.split(' ');
        if (type == "Bearer" && token) {
            return token;
        }
    }
    return null;
}



/*************************************************************************************
 * Decodes an encrypted web token.
 * 
 * Can throw an error.
 *************************************************************************************/
function decodeToken(token) {
    return jwt.verify(token, WebTokenPassword);
}



/*************************************************************************************
 * Make the functions usable from other modules.
 *************************************************************************************/
module.exports.getNewToken = getNewToken;
module.exports.extractToken = extractToken;
module.exports.decodeToken = decodeToken;