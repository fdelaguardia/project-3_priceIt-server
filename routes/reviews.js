var express = require('express');
var router = express.Router();

const Review = require('../models/Review')
const User = require('../models/User')

/* GET users listing. */
router.get('/', (req, res, next) => {
    Review.find()
        .populate('seller')
        .sort({createdAt: -1})
        .then((foundReviews) => {
            res.json(foundReviews)
        })
        .catch((err) => {
            console.log(err)
        })
})






router.post('/create-review/:userId', (req, res, next) => {
    Review.create({
            rates: req.body.rates,
            review: req.body.review,
            seller: req.params.userId,
        })
        .then((createdReview) => {
            User.findByIdAndUpdate(req.params.userId, {
                    $push: {reviews: createdReview._id}
                }, {new: true})
                .then((updatedUser) => {
                    console.log(updatedUser)
                })
                .catch((err) => {
                    console.log(err)
                })
                res.json(createdReview)
        })
        .catch((err) => {
            console.log(err)
        })
})





module.exports = router;