var express = require('express');
const database = require('../private/js/database');
const amadeusConnector = require('../private/js/amadeusConnector')
var router = express.Router();
var routeProtectors = require('../middleware/routeProtectors');



// Meet the Team route
router.get('/', (req, res, next) => {
  res.render("aboutus", {
    layout: 'globetrotter',
    filename: "style",
    title: "About Us"
  })
});



/*************************************************************************************
 * Taylor's individual About page will be displayed at this endpoint. It will be
 * displayed using the globetrotter layout and the individual-about-style stylesheet.
 *************************************************************************************/
router.get('/taylor', (req, res, next) => {
    res.render("about_us_pages/taylor", {
        layout: 'globetrotter',
        filename: "individual-about-style",
        title: "Taylor"
      });
});


/*************************************************************************************
 * Jesus' individual About page will be displayed at this endpoint. It will be
 * displayed using the globetrotter layout and the individual-about-style stylesheet.
 *************************************************************************************/
router.get('/jesus', (req, res, next) => {
  res.render("about_us_pages/jesus", {
      layout: 'globetrotter',
      filename: "individual-about-style",
      title: "Jesus"
    });
});

/*************************************************************************************
 * Kajeme's individual About page will be displayed at this endpoint. It will be
 * displayed using the globetrotter layout and the individual-about-style stylesheet.
 *************************************************************************************/
router.get('/kajeme', (req, res, next) => {
  res.render("about_us_pages/kajeme", {
      layout: 'globetrotter',
      filename: "individual-about-style",
      title: "Kajeme"
    });
});

/*************************************************************************************
 * Luis' individual About page will be displayed at this endpoint. It will be
 * displayed using the globetrotter layout and the individual-about-style stylesheet.
 *************************************************************************************/
router.get('/luis', (req, res, next) => {
  res.render("about_us_pages/luis", {
      layout: 'globetrotter',
      filename: "individual-about-style",
      title: "Luis"
    });
});


/*************************************************************************************
 * Robin's individual About page will be displayed at this endpoint. It will be
 * displayed using the globetrotter layout and the individual-about-style stylesheet.
 *************************************************************************************/
router.get('/robin', (req, res, next) => {
  res.render("about_us_pages/robin", {
      layout: 'globetrotter',
      filename: "individual-about-style",
      title: "Robin"
    });
});


/*************************************************************************************
 * Ruja's individual About page will be displayed at this endpoint. It will be
 * displayed using the globetrotter layout and the individual-about-style stylesheet.
 *************************************************************************************/
router.get('/ruja', (req, res, next) => {
  res.render("about_us_pages/ruja", {
      layout: 'globetrotter',
      filename: "individual-about-style",
      title: "Ruja"
    });
});


/*************************************************************************************
 * Yi's individual About page will be displayed at this endpoint. It will be
 * displayed using the globetrotter layout and the individual-about-style stylesheet.
 *************************************************************************************/
router.get('/yi', (req, res, next) => {
  res.render("about_us_pages/yi", {
      layout: 'globetrotter',
      filename: "individual-about-style",
      title: "Yi"
    });
});

/*************************************************************************************
 * Make the router usable from other modules (mainly app.js).
 *************************************************************************************/
 module.exports = router;