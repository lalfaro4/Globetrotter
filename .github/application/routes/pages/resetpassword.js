var express = require('express');
var router = express.Router();

var routeProtectors = require('../../middleware/routeProtectors');
const database = require('../../private/js/database');


router.get('/', (req, res, next) => {
    res.render("resetpassword", {
      layout: 'globetrotter',
      filename: 'resetpassword',
      title: 'Reset Password'
    })
});

module.exports = router;