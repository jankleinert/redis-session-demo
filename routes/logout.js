const express = require('express');
const router = express.Router();

/* GET request for logout page */
router.get('/', function(req, res, next) {
  var expireTime = new Date(req.session.cookie.expires) - new Date();   
  req.logout();
  req.session.destroy(function() {
    res.redirect('/');

  });
});

router.get('')

module.exports = router;
