var express = require('express');
const { databaseModule } = require('../private/js/database');
var router = express.Router();

// router.get('/', (req, res, next) => {
//   res.send("Bad URL.");
// });

router.get('/authenticate', (req, res, next) => {
  //
});

router.get('/', (req, res, next) => {
  var param = req.query.param;
  res.send(`API Parameter: ${param}`);
});

router.use((req, res) => {
  console.log(`index.js::errorTrap ${req.url}`);
  res.redirect(404, "/");
});

module.exports = router;
