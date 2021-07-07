var express = require('express');
const { databaseModule } = require('../private/js/database');
var router = express.Router();



/*************************************************************************************
 * Renders the page at URL '/'
 *************************************************************************************/
router.get('/', (req, res, next) => {
  res.render("welcome", {
    title: "Welcome"
  });
});

router.get('/search', (req, res, next) => {
  res.render("search",{
    title: "Search"
  });

});
/*************************************************************************************
 * Renders the page at URL '/home'
 *************************************************************************************/
router.get('/home', (req, res, next) => {
});



/*************************************************************************************
 * Renders the page at URL '/vp'
 *************************************************************************************/
router.get('/vp', (req, res, next) => {
  res.render("verticalPrototype", {
    title: "Vertical Prototype"
  });
});



/*************************************************************************************
 * Sends the same session information that the user provided with their request back
 * in the response.
 *************************************************************************************/
// /* This gets called at the beginning of every request from a client.
//  */
// router.use((req, res, next) => {
//   console.log("Setting locals.");
//   if(req.session.username) {
//       res.locals.session = req.session;
//       res.locals.logged = true;
//   }
//   next();
// });



/*************************************************************************************
 * Error trap for any URL's that the router doesn't know how to handle.
 *************************************************************************************/
router.use((req, res) => {
  console.log(`index.js::errorTrap ${req.url}`);
  res.redirect(404, "/");
});



/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
module.exports = router;
