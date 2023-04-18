var express = require('express');
var router = express.Router();

const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST request to create a new user
router.post('/users', (req, res) => {

  // Create new user with form information
  const newUser = new User({
    first_name: req.body.firstName,
    tasks: []
  })
  newUser.save()

  // Successfully saved new user
  .then(new_user => {
    return res.status(200).json({success: true, new_user: new_user})
  })
  // Unsuccessfully saved new user
  .catch(err => {
    return res.status(500).json({err: err, success: false})
  })
})

module.exports = router;