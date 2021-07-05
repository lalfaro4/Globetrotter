var express = require('express');
var router = express.Router();
var database = require('../private/js/database');
var userIsLoggedIn = require('../middleware/routeProtectors').userIsLoggedIn;
var userIsNotLoggedIn = require('../middleware/routeProtectors').userIsNotLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;

router.get('/', userIsNotLoggedIn, (req, res, next) => {
  res.render("login", {
    title: "Login"
  });
});

router.get('/login', userIsNotLoggedIn, (req, res, next) => {
  res.render("login", {
    title: "Login"
  });
});

router.get('/registration', (req, res, next) => {
  res.render("registration", {
    title: "Registration"
  });
});

router.get('/home', userIsLoggedIn, getRecentPosts, (req, res, next) => {
  res.render("home", {
    title: "Home"
  });
});

router.get('/postimage', userIsLoggedIn, (req, res, next) => {
  res.render("postimage", {
    title: "Post Image"
  });
});

router.use((req, res) => {
  console.log(`index.js::errorTrap ${req.url}`);
  req.flash("error", "Couldn't find anything there.");
  res.redirect(404, "/");
});

module.exports = router;
