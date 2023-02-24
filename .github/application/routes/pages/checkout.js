var express = require('express');
var router = express.Router();

var routeProtectors = require('../../middleware/routeProtectors');
const database = require('../../private/js/database');
const amadeusConnector = require('../../private/js/amadeusConnector');


router.get('/', (req, res, next) => {
    res.render("checkout", {
        layout: 'globetrotter',
        filename: "checkout",
        title: "Checkout"
      });
});

module.exports = router;