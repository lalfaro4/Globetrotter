var express = require('express');
var router = express.Router();
// var database = require('../private/js/database');
// var userIsLoggedIn = require('../middleware/routeProtectors').userIsLoggedIn;

router.get('/', (req, res, next) => {
  res.render("welcome", {
    title: "Welcome"
  });
});

// router.get('/', userIsNotLoggedIn, (req, res, next) => {
//   res.render("login", {
//     title: "Login"
//   });
// });

// router.get('/login', userIsNotLoggedIn, (req, res, next) => {
//   res.render("login", {
//     title: "Login"
//   });
// });

// router.get('/registration', (req, res, next) => {
//   res.render("registration", {
//     title: "Registration"
//   });
// });

// router.get('/home', userIsLoggedIn, getRecentPosts, (req, res, next) => {
//   res.render("home", {
//     title: "Home"
//   });
// });

router.use((req, res) => {
  console.log(`index.js::errorTrap ${req.url}`);
  // req.flash("error", "Couldn't find anything there.");
  res.redirect(404, "/");
});

module.exports = router;
