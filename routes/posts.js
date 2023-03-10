var express = require('express');
var router = express.Router();

const Post = require('../models/Post')
const User = require('../models/User')

const fileUploader = require('../config/cloudinary.config')



router.get('/', (req, res, next) => {
    Post.find()
        .populate('seller')
        .sort({createdAt: -1})
        .then((foundPosts) => {
            res.json(foundPosts)
        })
        .catch((err) => {
            console.log(err)
        })
})




router.post("/upload-image", fileUploader.single('postImages'), (req, res) => {
    console.log(req.file)
    if (!req.file) {
      return res.status(500).json({ msg: "Upload fail." });
    }
  
    return res.status(201).json({ url: req.file.path });
  });
 




router.get('/post-detail/:id', (req, res, next) => {
    Post.findOne({_id: req.params.id})
        .populate({path: 'seller', 
            populate: [
                {path: 'reviews'},
                {path: 'posts'}
            ]
        })
        .then((foundPost) => {
            res.json(foundPost)
        })
        .catch((err) => {
            console.log(err)
        })
})

  
 


router.post('/create-post/:userId', (req, res, next) => {
    Post.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            condition: req.body.condition,
            seller: req.params.userId,
            postImages: req.body.postImages,
        })
        .then((createdPost) => {
            User.findByIdAndUpdate(req.params.userId, {
                    $push: {posts: createdPost._id}
                }, {new: true})
                .then((updatedUser) => {
                    console.log(updatedUser)
                })
                .catch((err) => {
                    console.log(err)
                })
                return createdPost
        })
        .then((post) => {
            return post.populate('seller')
        })
        .then((final) => {
            res.json(final)
        })
        .catch((err) => {
            console.log(err)
        })
})
 




router.post('/edit-post/:postId', (req, res, next) => {
    Post.findByIdAndUpdate(req.params.postId, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            condition: req.body.condition,
            postImages: req.body.postImages,
        }, {new: true})
        .then((updatedPost) => {
            res.json(updatedPost)
        })
        .catch((err) => {
            console.log(err)
        })
})





router.get('/delete-post/:postId', (req, res, next) => {
    Post.findByIdAndDelete(req.params.postId)
        .then((deletedPost) => {
            res.json(deletedPost)
        })
        .catch((err) => {
            console.log(err)
        })
})





module.exports = router;