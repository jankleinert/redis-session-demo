const express = require('express');
const router = express.Router();
const request = require('request');

/* GET request for home page */
router.get('/', function(req, res, next) { 
  res.render('index', { beerName: null, beerStyle: null, error: null });
});


router.post('/', function (req, res) {
  request('https://www.craftbeernamegenerator.com/api/api.php?type=trained', function (err, response, body) {
    if(err){
      res.render('index', { beerName: null, beerStyle: null, error: 'Error, please try again'});
    } else {
      var beerInfo = JSON.parse(body)

      if(beerInfo.status != 200){
        res.render('index', { beerName: null, beerStyle: null, error: 'Error, please try again'});
      } else {
        res.render('index', { beerName: beerInfo.data.name, beerStyle: beerInfo.data.style, error: null});
      }
    }
  });
})

router.get('')

module.exports = router;
