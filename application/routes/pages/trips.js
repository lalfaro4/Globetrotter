var express = require('express');
var router = express.Router();

var routeProtectors = require('../../middleware/routeProtectors');
const database = require('../../private/js/database');



/*************************************************************************************
 * Logging function for index.js
 *************************************************************************************/
function log(message, type) {
    if (type == 'success') {
        console.log(`trips.js:: ${message}`.bgBrightYellow.black);
    } else if (type == "info") {
        console.log(`trips.js:: ${message}`.bgBrightYellow.black);
    } else if (type == 'fail') {
        console.log(`trips.js:: ${message}`.italic.bgRed.black);
    }
}


router.get('/create', routeProtectors.userIsLoggedIn, async (req, res, next) => {
    log(req.session.user, 'info');
    log(req.query.tripName, 'info');
    if(req.query.tripName) {
        var tripId = '';
        var albumId = '';
        var result = await database.createTrip(req.session.user.user_id, req.query.tripName, tripId, albumId);
        if(result) {
            tripId = result[1][0]['@tripId'];
            res.redirect(`/planner?trip_id=${tripId}`);
        } else {
            res.redirect('/');
        }
    }
});



router.post('/:tripid/update', routeProtectors.userIsLoggedIn, async (req, res, next) => {
    var tripId = req.params.tripid;
    log(`Body: ${req.body}`, 'info');
    log(`Updating trip: ${tripId}`, 'info');
    var result = database.updateTrip(tripId, req.query.tripName);
    res.send({ result: 'Updating' });
});


router.delete('/:tripId', routeProtectors.userIsLoggedIn, async (req, res, next) => {
    var result = database.deleteTrip(req.params.tripId);
    res.send({ result: 'Delete' });
});


module.exports = router;