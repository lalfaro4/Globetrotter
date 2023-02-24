var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render("termsandconditions", {
      layout: 'globetrotter',
      filename: 'termsandconditions',
      title: 'Terms and Conditions'
    })
});


module.exports = router;