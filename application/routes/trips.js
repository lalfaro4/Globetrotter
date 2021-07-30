var express = require('express');
var router = express.Router();
var database = require('../private/js/database');
var routeProtectors = require('../middleware/routeProtectors');



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


router.post('/create', async (req, res, next) => {
    console.log('POSTS');
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



router.post('/:tripid/update', async (req, res, next) => {
    console.log('UPDATE');
    var tripId = req.params.tripid;
    log(`Body: ${req.body}`, 'info');
    log(`Updating trip: ${tripId}`, 'info');
    var result = database.updateTrip(tripId, req.query.tripName);
    res.send({ result: 'Updating' });
});


module.exports = router;