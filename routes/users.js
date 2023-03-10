var express = require('express');
var router = express.Router();

const User = require('../models/User')

const fileUploader = require('../config/cloudinary.config')


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




router.post("/upload-image", fileUploader.single('profileImage'), (req, res) => {
  console.log(req.file)
  if (!req.file) {
    return res.status(500).json({ msg: "Upload fail." });
  }

  return res.status(201).json({ url: req.file.path });
});




router.post('/edit-profile/:userId', (req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, {
      firstName: req.body.firstName,
      email: req.body.email,
      lastName: req.body.lastName,
      state: req.body.state,
      city: req.body.city,
      profileImage: req.body.profileImage,
    }, {new: true})
    .then((updatedUser) => {
      res.json(updatedUser)
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = router;
