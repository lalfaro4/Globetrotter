var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();
var routeProtectors = require('../middleware/routeProtectors');


router.get('/', (req, res, next) => {
    res.render("privacy", {
      layout: 'globetrotter',
      filename: 'termsandconditions',
      title: 'Privacy'
    })
});


module.exports = router;