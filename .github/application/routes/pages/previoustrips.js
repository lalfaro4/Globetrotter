var express = require('express');
var router = express.Router();

var database = require('../../private/js/database');
var routeProtectors = require('../../middleware/routeProtectors');



//
router.get('/', routeProtectors.userIsLoggedIn, async (req, res, next) => {

    var trips = await database.getTripsByOwner(req.session.user.user_id);
    console.log(trips);

    res.render("previoustrips", {
        layout: 'globetrotter',
        filename: "previoustrips",
        title: "Previous Trips",
        trips: trips
    });
});



/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
module.exports = router;