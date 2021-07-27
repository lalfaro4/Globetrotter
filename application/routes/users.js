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



router.post('/register', async (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let address = req.body.addressl
    let address2 = req.body.address2;
    let city = req.body.city;
    let state = req.body.state;
    let zipcode = req.body.zipcode;
    let phoneNumber = req.body.phoneNumber;

    // var validated = validator.validateUsername(username) &&
    //     validator.validateEmail(email) &&
    //     validator.validatePassword(password) &&
    //     password == confirmpassword;

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
    var user;
    try {
        user = await database.createUser(email, username, password, firstName, lastName,
            birthday, gender, null, address, address2, city, state, 'US', zipcode, 1, phoneNumber,);
    } catch (error) {
        log("Error creating user.", 'fail');
        res.redirect('/registration');
    }
    
    if(user) {
        log(JSON.stringify(user), "info");
        res.redirect('/login');
    }

});

router.post('/update', routeProtectors.userIsNotLoggedIn, async (req, res, next) => {
    // Get a variable from req.body about which user to update

    // Call the database function for updating a user if the user exists.

    // Handle errors and/or redirect
});

router.post('/login', routeProtectors.userIsNotLoggedIn, async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    var user = await database.authenticate(username, password);
    if (user) {
        req.session.username = username;
        req.session.userid = user.user;
        req.session.user = user;
        res.locals.logged = true;
        req.session.save();
        log(`User ${username} is logged in.`, "success");
        res.redirect('/home');
    } else {
        /* Invalid login */
        log("Invalid user login", "fail");
        res.redirect(`/login?message=Login failed.`);
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