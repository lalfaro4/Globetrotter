var express = require('express');
var router = express.Router();
var database = require('../private/js/database');
var routeProtectors = require('../middleware/routeProtectors');



/*************************************************************************************
 * Logging function for index.js
 *************************************************************************************/
function log(message, type) {
    if (type == 'success') {
        console.log(`users.js:: ${message}`.bgBrightYellow.black);
    } else if (type == "info") {
        console.log(`users.js:: ${message}`.bgBrightYellow.black);
    } else if (type == 'fail') {
        console.log(`users.js:: ${message}`.italic.bgRed.black);
    }
}



router.post('/register', (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let adress = req.body.addressl
    let address2 = req.body.address2;
    let city = req.body.city;
    let state = req.body.state;
    let zipcode = req.body.zipcode;
    let phoneNumber = req.body.phoneNumber;

    var validated = validator.validateUsername(username) &&
        validator.validateEmail(email) &&
        validator.validatePassword(password) &&
        password == confirmpassword;

    // Check if username is already in use
    var user = database.getUserByUsername(username);
    if(user) {
        /* Username taken */
    }

    // Check if email is already in use
    user = database.getUserByEmail(email);
    if(user) {
        /* Email taken */
    }

    // Create User
    

    database.getUserByUsername(username)
        .then(
            (user) => {
                if (user == null) {
                    return database.getUserByEmail(email)
                } else {
                    throw new Error("Registration Failed: username (" + username + ") already in use.", "/registration", 200);
                }
            })
        .then(
            (user) => {
                if (user == null) {
                    return database.createUser(username, email, password);
                } else {
                    throw new Error("Registration Failed: email (" + email + ") already in use.", "/registration", 200);
                }
            })
        .then(
            (response) => {
                console.log(response);
                req.flash("success", "User created successfuly.");
                if (response) {
                    res.redirect("/login");
                } else {
                    throw new Error("Registration Failed: An error occurred while creating the user.", "/registration", 200);
                }
            })
        .catch(
            (e) => {
                console.log(e);
                req.flash("error", e.message);
                res.redirect("/registration");
            });

});

router.post('/login', routeProtectors.userIsNotLoggedIn, async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    var user = await database.authenticate(username, password);
    if (user) {
        req.session.username = username;
        req.session.userid = user.id;
        res.locals.logged = true;
        log(`User ${username} is logged in.`, "success");
        res.redirect("/home");
    } else {
        /* Invalid login */
    }

});

router.post('/logout', routeProtectors.userIsLoggedIn, (req, res, next) => {
    log("Trying to log out", "info");
    req.session.destroy((err) => {
        if (err) {
            log("Session could not be destroyed.", "error");
            next(err);
        } else {
            log("Session was successfully destroyed.", "error");
            res.redirect('/home');
        }
    });

})

module.exports = router;