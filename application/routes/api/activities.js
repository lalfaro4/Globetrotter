var express = require('express');
var database = require('../../private/js/database');
var { log } = require('./logger');
var router = express.Router();



/*************************************************************************************
 * API Endpoint: POST /api/activities/
 *************************************************************************************/
router.post('/', async (req, res, next) => {
  var startLocationId;
  var endLocationId;
  if (req.query.originCode) {
    startLocationId = (await database.getAirportByIATACode(req.query.originCode))[0].location_id;
  }
  if (req.query.destinationCode) {
    endLocationId = (await database.getAirportByIATACode(req.query.destinationCode))[0].location_id;
  }
  console.log(req.query.flightOfferJSONData);
  var result = await database.createFlightActivity(
    req.session.user.user_id, req.query.tripId,
    req.query.startTime, req.query.endTime,
    startLocationId, endLocationId,
    req.query.flightOfferJSONData
  )
  if (result) {
    log('Flight activity created.', 'success');
    res.send('Activity created');
  }
});



/*************************************************************************************
 * API Endpoint: PUT /api/activities/
 *************************************************************************************/
 router.put('/:activityId', async (req, res, next) => {
  log('PUT activity', 'info');
  var startLocationId;
  var endLocationId;
  if (req.query.originCode) {
    startLocationId = (await database.getAirportByIATACode(req.query.originCode))[0].location_id;
  }
  if (req.query.destinationCode) {
    endLocationId = (await database.getAirportByIATACode(req.query.destinationCode))[0].location_id;
  }
  var result = await database.updateFlightActivity(req.params.activityId, req.query.startTime, 
    req.query.endTime, startLocationId, endLocationId, req.query.flightOfferJSONData);
  if (result) {
    log('Flight activity updated.', 'success');
    res.send('Flight activity updated');
  }
});



/*************************************************************************************
 * API Endpoint: DELETE /api/activities/{activityId}
 *************************************************************************************/
router.delete('/:activityId', async (req, res, next) => {
  var result = await database.deleteActivity(req.params.activityId);
  if (result) {
    log('Activity deleted.', 'success');
    res.send('Activity deleted');
  }
});



/*************************************************************************************
* Make the router usable from other modules.
*************************************************************************************/
module.exports = router;