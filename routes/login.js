const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET request for login page */
router.get('/', function(req, res, next) {
  var expireTime = new Date(req.session.cookie.expires) - new Date();
  res.render('login', { sessionID: req.sessionID, sessionExpireTime: expireTime, beersViewed: req.session.views, error: null, isAuthenticated: req.isAuthenticated(), email: (req.isAuthenticated() ? req.user.email : null) });
});


router.post('/', function (req, res, next) {
  var expireTime = new Date(req.session.cookie.expires) - new Date();
  passport.authenticate('local', (err, user, info) => {
    if(info) {return res.send(info.message)}
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      res.render('login', {sessionID: req.sessionID, sessionExpireTime: expireTime, beersViewed: req.session.views, username: req.user.id, error: null, isAuthenticated: req.isAuthenticated(), email: (req.isAuthenticated() ? req.user.email : null)});
    })
  })(req, res, next);
})  

router.get('')

module.exports = router;
