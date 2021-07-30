var express = require('express');
var router = express.Router();

var routeProtectors = require('../../middleware/routeProtectors');
const database = require('../../private/js/database');



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