var express = require('express');
var database = require('../../private/js/database');
var { log } = require('./logger');
var router = express.Router();



/*************************************************************************************
 * API Endpoint: GET /api/users
 *************************************************************************************/
router.get('/', async (req, res, next) => {
  var users = await database.getAllUsers();
  if (users.length > 0) {
    log(`Found ${users.length} users.`, "success");
    res.send(users);
  } else {
    log("No users found.", "success");
    res.send({ result: "No users found." });
  }
});



/*************************************************************************************
 * API Endpoint: GET /api/users/search
 *************************************************************************************/
router.get('/search', async (req, res, next) => {
  var username = req.query.username;
  var email = req.query.email;
  var users;
  if (username) {
    users = await database.searchUsersByUsername(username);
  } else if (email) {
    users = await database.searchUsersByEmail(email);
  }
  if (users && users.length > 0) {
    log(`Found ${users.length} users.`, "success");
    res.send(JSON.stringify(users, null, 4));
  } else {
    log("No users found.", "success");
    res.send({ result: "No users found." });
  }
});



/*************************************************************************************
* API Endpoint: GET /api/users/me/update
*************************************************************************************/
router.post('/me/update', async (req, res, next) => {
  console.log(req.body);
  if (req.session && req.session.user) {
    if (req.body.username && req.body.firstName && req.body.lastName &&
      req.body.gender && req.body.birthdayYear && req.body.birthdayMonth &&
      req.body.birthdayDay && req.body.addressLine1 &&
      req.body.city && req.body.state && req.body.postalCode &&
      req.body.primaryPhoneNumber) {
      try {
        console.log('Attempting update');
        var result = await database.updateUserProfile(req.session.user.user_id, req.body.username, req.body.firstName, req.body.lastName,
          req.body.gender, req.body.birthdayYear + '-' + req.body.birthdayMonth + '-' + req.body.birthdayDay,
          req.body.addressLine1, req.body.city, req.body.state, req.body.postalCode,
          req.body.primaryPhoneNumber[0], req.body.primaryPhoneNumber.slice(1),
          req.body.secondaryPhoneNumber[0], req.body.secondaryPhoneNumber.slice(1));
        if (result) {
          req.session.user = await database.getUserByUsername(req.body.username);
          res.send({
            result: "User updated successully.",
            user: req.session.user
          });
        }
      } catch (error) {
        log(error, "fail");
        res.send({ result: "Error finding user." });
      }
    } else {
      log("Missing parameters.", "fail");
      res.send({ result: "Missing parameters." })
    }
  } else {
    log("Not logged in.", "fail");
    res.send({ result: "Not logged in." });
  }
});



/*************************************************************************************
 * API Endpoint: GET /api/users/me
 *************************************************************************************/
router.get('/me', async (req, res, next) => {
  console.log(req.session.user);
  if (req.session && req.session.user) {
    try {
      var user = await database.getUserByUsername(req.session.user.username);
      if (user) {
        log("Found you!", "success");
        res.send(user);
      } else {
        log("Could not find user.", "fail");
        res.send({ result: "Could not find user." });
      }
    } catch (error) {
      log("Error finding user.", "fail");
      res.send({ result: "Error finding user." });
    }
  } else {
    log("Not logged in.", "fail");
    res.send({ result: "Not logged in." });
  }
});



/*************************************************************************************
 * API Endpoint: PUT /api/users
 * 
 * Todo: Check if this is an update or creation (does user exist?)
 * May need a new database method.
 *************************************************************************************/
// router.put('/', async (req, res, next) => {
//   var username = req.query.username;
//   var password = req.query.password;
//   var email = req.query.email;
//   if (username && password && email) {
//     var user = await database.createUser(username, password, email);
//     if (user) {
//       log("User created successfully.", "success");
//       res.send({ result: "User created successfully." });
//     } else {
//       log("Error creating user.", "fail");
//       res.send({ result: "Error creating user." });
//     }
//   } else {
//     log("Missing parameter(s).", "fail");
//     res.send({ result: "Missing parameter(s)." });
//   }
// });



/*************************************************************************************
* Make the router usable from other modules.
*************************************************************************************/
module.exports = router;
