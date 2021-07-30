var express = require('express');
var router = express.Router();

var database = require('../../private/js/database');
var routeProtectors = require('../../middleware/routeProtectors');



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



router.post('/register', routeProtectors.userIsNotLoggedIn, async (req, res, next) => {
    console.log(req.body);
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let address1 = req.body.addressl
    let address2 = req.body.address2;
    let city = req.body.city;
    let state = req.body.state;
    let zipcode = req.body.zipcode;
    let phoneNumber = req.body.phoneNumber;

    // Check if username is already in use
    var user = await database.getUserByUsername(username);
    if (user) {
        log('username already in use', 'fail');
        return res.redirect(`/registration?message=username already in use.`);
    }

    // Check if email is already in use
    user = await database.getUserByEmail(email);
    if (user) {
        log('email already in use', 'fail');
        return res.redirect(`/registration?message=email already in use.`);
    }

    // Create User
    var user;
    try {
        user = await database.createUser(email, username, password, firstName, lastName,
            birthday, gender, 'USD', address1, address2, city, state, 'US', zipcode, 1, phoneNumber);
    } catch (error) {
        log("Error creating user.", 'fail');
        return res.redirect('/registration');
    }

    if (user) {
        log(JSON.stringify(user), "info");
        return res.redirect('/login?message=Account created successfully!');
    }

});

router.post('/resetpassword', routeProtectors.userIsNotLoggedIn, async (req, res, next) => {
    let email = req.body.email;
    let username = req.body.username;
    let newPassword = req.body.newPassword;
    if (email && username && newPassword) {
        var result = await database.resetUserPassword(username, email, newPassword);
        if (result) {
            res.redirect('/login?message=Password reset successfully.');
        } else {
            res.redirect('/login?message=Error resetting password.');
        }
    } else {
        res.redirect('/login?message=Missing parameters.');;
    }
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
        log(req.session.user, 'info');
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