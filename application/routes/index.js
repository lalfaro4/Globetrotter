var express = require('express');
const { databaseModule } = require('../private/js/database');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render("welcome", {
    title: "Welcome"
  });
});

router.get('/home', (req, res, next) => {
});

router.get('/vp', (req, res, next) => {
  res.render("verticalPrototype", {
    title: "Vertical Prototype"
  });
});

router.use((req, res) => {
  console.log(`index.js::errorTrap ${req.url}`);
  res.redirect(404, "/");
});

module.exports = router;
