/*************************************************************************************
 * Logging function for api.js
 *************************************************************************************/
 function log(message, type) {
    if (type == 'success') {
      console.log(`api.js:: ${message}`.bgBrightYellow.black);
    } else if (type == "info") {
      console.log(`api.js:: ${message}`.bgBrightYellow.black);
    } else if (type == 'fail') {
      console.log(`api.js:: ${message}`.italic.bgRed.black);
    }
  }

  module.exports.log = log;