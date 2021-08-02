var express = require('express');
var router = express.Router();

var database = require('../../private/js/database');
var routeProtectors = require('../../middleware/routeProtectors');



/*************************************************************************************
 * Renders the page at URL '/accountmanagement'
 *************************************************************************************/
 router.get('/', routeProtectors.userIsLoggedIn, (req, res, next) => {
    res.render("accountmanagement", {
      layout: 'globetrotter',
      filename: "accountmanagement",
      title: "Account Management"
    });
  });



/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
module.exports = router;