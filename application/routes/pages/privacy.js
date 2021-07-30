var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render("privacy", {
      layout: 'globetrotter',
      filename: 'termsandconditions',
      title: 'Privacy'
    })
});


module.exports = router;