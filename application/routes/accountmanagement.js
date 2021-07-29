var express = require('express');
const database = require('../private/js/database');
var router = express.Router();



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
 * Renders the page at URL '/accountmanagement'
 *************************************************************************************/
 router.get('/update', routeProtectors.userIsLoggedIn, (req, res, next) => {
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