var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();
var routeProtectors = require('../middleware/routeProtectors');



// Meet the Team route
router.get('/', (req, res, next) => {

});



router.get('/taylor', (req, res, next) => {
    res.render("about_us_pages/taylor", {
        layout: 'globetrotter',
        filename: "about",
        title: "Taylor"
      });
});



/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
 module.exports = router;