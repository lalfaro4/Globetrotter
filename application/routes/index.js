var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render("welcome", {
    title: "Welcome"
  });
});

router.use((req, res) => {
  console.log(`index.js::errorTrap ${req.url}`);
  res.redirect(404, "/");
});

module.exports = router;
