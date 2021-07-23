var jwt = require('jsonwebtoken');
const WebTokens = require('../private/js/webTokens');



/*************************************************************************************
 * Logging function for routeProtector.js
 *************************************************************************************/
function log(message, type) {
    if (type == 'success') {
        console.log(`routeProtector.js:: ${message}`.bgGreen.white);
    } else if (type == "info") {
        console.log(`routeProtector.js:: ${message}`.bgGreen.white);
    } else if (type == 'fail') {
        console.log(`routeProtector.js:: ${message}`.italic.bgRed.black);
    }
}



function userIsLoggedIn(req, res, next) {
    log("userIsLoggedIn?", "info");
    if (req.session && req.session.username) {
        log("user is logged in.");
        next();
    } else {
        log("user is not logged in. Redirecting to /login", "error");
        res.redirect("/login");
    }
}

function userIsNotLoggedIn(req, res, next) {
    if (!req.session || !req.session.username) {
        log("Route protector: user is not logged in.", "info");
        next();
    } else {
        log("RouteProtector|userIsNotLoggedIn: user is already logged in. Redirecting to /home.", "error");
        res.redirect("/home");
    }
}



/*************************************************************************************
 * Route Protector: Checks if a request has a token then yields back to the next 
 * route in the router that called it.
 * 
 * TODO: Check if username in 'decodedToken' has proper roles/permissions for the URL
 * in req.originalUrl.
 *************************************************************************************/
function authorization(req, res, next) {
    var token = WebTokens.extractToken(req);
    if (token) {
        try {
            var decodedToken = WebTokens.decodeToken(token);
            // console.log(decodedToken);
            // console.log(req.originalUrl);
            log("Authorization token validated.", "success");
            next();
        } catch (err) {
            log("Invalid authorization token.", "Fail");
            res.send({ result: "Invalid authorization token." });
        }
    } else {
        log("Missing authorization token.", "fail");
        res.send({ result: "Missing authorization token." });
    }
}



/*************************************************************************************
 * Make the route protectors usable from other modules (mainly the routers).
 *************************************************************************************/
module.exports.authorization = authorization;
module.exports.userIsLoggedIn = userIsLoggedIn;
module.exports.userIsNotLoggedIn = userIsNotLoggedIn;