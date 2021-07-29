var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();
var routeProtectors = require('../middleware/routeProtectors');




router.get('/', routeProtectors.userIsLoggedIn, async (req, res, next) => {

    var trips = await database.getSavedTripsByOwner(req.session.user.user_id);
    console.log(trips);

    res.render("savedtrips", {
        layout: 'globetrotter',
        filename: "savedtrips",
        title: "Saved Trips",
        trips: trips
    });
});



/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
module.exports = router;