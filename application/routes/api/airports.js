var express = require('express');
var database = require('../../private/js/database');
var { log } = require('./logger');
var router = express.Router();



/*************************************************************************************
 * API Endpoint: GET /api/airports/search
 *************************************************************************************/
 router.get('/search', async (req, res, next) => {
    var airports = await database.searchAirportsByName(req.query.searchString);
    res.send(airports);
  });



  /*************************************************************************************
 * Make the router usable from other modules.
 *************************************************************************************/
module.exports = router;
