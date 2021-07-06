var express = require('express');
var database = require('../private/js/database');
var router = express.Router();

router.get('/authenticate', (req, res, next) => {
  var username = req.query.username;
  var password = req.query.password;
  var user = database.authenticate(username, password)
  .then(
    (user) => {
      if(user) {
        res.send({ result: "Success" });
      } else {
        res.send({ result: "Fail" });
      }
    }
  );
});

router.put('/users', (req, res, next) => {
  console.log(req.sessionID);
  var username = req.query.username;
  var password = req.query.password;
  var user = database.createUser(username, password)
  .then(
    (user) => {
      res.send(user);
    }
  );
});

router.use((req, res) => {
  console.log(`api.js::errorTrap ${req.url}`);
  res.redirect(404, "/");
});

module.exports = router;
