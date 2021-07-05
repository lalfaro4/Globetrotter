var express = require('express');
var router = express.Router();
var validator = require('../public/js/validation');
var database = require('../private/js/database');
const { userIsNotLoggedIn, userIsLoggedIn } = require('../middleware/routeProtectors');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmpassword = req.body.confirmpassword;

  var validated = validator.validateUsername(username) &&
    validator.validateEmail(email) &&
    validator.validatePassword(password) &&
    password == confirmpassword;

  database.getUserByUsername(username)
  .then(
    (user) => {
      if(user == null) {
        return database.getUserByEmail(email)
      } else {
        throw new Error("Registration Failed: username (" + username + ") already in use.", "/registration", 200);
      }
    })
  .then(
    (user) => {
      if(user == null) {
        return database.createUser(username, email, password);
      } else {
        throw new Error("Registration Failed: email (" + email + ") already in use.", "/registration", 200);
      }
    })
  .then(
    (response) => {
      console.log(response);
      req.flash("success", "User created successfuly.");
      if(response) {
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

router.post('/login', userIsNotLoggedIn, (req, res, next) => {

  console.log(req.body);

  let username = req.body.username;
  let password = req.body.password;

  database.authenticate(username, password).then(
    (user) => {
      if(user) {
        req.session.username = username;
        req.session.userid = user.id;
        res.locals.logged = true;
        console.info(`User ${username} is logged in.`);
        req.flash("success", `User ${username} is logged in.`);
        res.redirect("/home");
      } else {
        throw new Error("Invalid username and/or password!", "/login", 200);
      }
    }
  )
  .catch(
    (e) => {
      console.log(e.message);
      req.flash("error", e.message);
      res.redirect("/login");
    }
  );

});

router.post('/logout', userIsLoggedIn, (req, res, next) => {
  console.log(req.body);
  req.session.destroy((err) => {
    if(err) {
      console.log("Session could not be destroyed.");
      next(err);
    } else {
      console.log("Session was successfully destroyed.");
      res.json({status: "OK", message: ""});
    }
  });

})

module.exports = router;
