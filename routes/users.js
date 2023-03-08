var express = require('express');
var router = express.Router();

const User = require('../models/User')

/* GET users listing. */
router.get('/profile/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .populate('posts')
    .then((foundUser) => {
      res.json(foundUser)
    })
    .catch((err) => {
      console.log(err)
    })
});

router.post('/edit-profile/:userId', (req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, {
      firstName: req.body.firstName,
      email: req.body.email,
      // lastName: req.body.lastName,
      // profileImage: req.body.profileImage,
      // state: req.body.state,
      // city: req.body.city,
    }, {new: true})
    .then((updatedUser) => {
      res.json(updatedUser)
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router;
