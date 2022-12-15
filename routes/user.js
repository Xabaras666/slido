var express = require('express');
var router = express.Router();

/* GET users listing. */



router.get('/dashboard', (req, res, next) => {
  res.render('dashboard', { user: req.user.first_name})
})

module.exports = router;
