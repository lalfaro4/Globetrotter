var express = require('express');
var router = express.Router();

var routeProtectors = require('../../middleware/routeProtectors');
const database = require('../../private/js/database');


router.get('/', async (req, res, next) => {
    var albums = await database.getAlbumsSharedWithUser(req.session.user.user_id);
    console.log(albums);
    res.render("sharedalbums", {
        layout: 'globetrotter',
        filename: "sharedalbums",
        title: "Shared Albums",
        albums: albums
      });
});

module.exports = router;