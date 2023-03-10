var express = require("express");
var router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const isAuthenticated = require('../middleware/isAuthenticated')

const fileUploader = require('../config/cloudinary.config')




/* GET users listing. */
router.post("/signup", (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "please fill out all fields" });
    }

    User.findOne({email: req.body.email})
        .then((foundUser) => {
            if(foundUser){
                return res.status(400).json({message: "This email is already registerd"})
            } else {
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashedPass = bcrypt.hashSync(req.body.password, salt);

                User.create({
                    password: hashedPass,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    state: req.body.state,
                    profileImage: req.body.profileImage,
                    city: req.body.city,
                  })
                  .then((createdUser) => {
                      const payload = { _id: createdUser._id, email: createdUser.email, firstName: createdUser.firstName };
                      
                      const token = jwt.sign(payload, process.env.SECRET, {
                        algorithm: "HS256",
                        expiresIn: "24hr",
                      });

                       res.json({ token: token, _id: createdUser._id, message: `Welcome ${createdUser.firstName}`  });
                  })
                  .catch((err) => {
                    res.status(400).json(err.message);
                  })
            }
        })
        .catch((err) => {
            res.status(400).json(err.message);
        })
    
});






router.post("/upload-image", fileUploader.single('profileImage'), (req, res) => {
    console.log(req.file)
    if (!req.file) {
      return res.status(500).json({ msg: "Upload fail." });
    }
  
    return res.status(201).json({ url: req.file.path });
  });







router.post('/login', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Please fill out both fields" });
    }

    User.findOne({email: req.body.email})
        .then((foundUser) => {
            if(!foundUser){
                return res.status(401).json({message: "Email or Password are incorrect"})
            }

            const doesMatch = bcrypt.compareSync(
                req.body.password,
                foundUser.password
            );

            if(doesMatch){
                const payload = { _id: foundUser._id, 
                email: foundUser.email,
                firstName: foundUser.firstName,
                profileImage: foundUser.profileImage,
                lastName: foundUser.lastName,
                state: foundUser.state,
                city: foundUser.city,
                posts: foundUser.posts };

                const token = jwt.sign(payload, process.env.SECRET, {
                    algorithm: "HS256",
                    expiresIn: "24hr",
                });
                res.json({ _id: foundUser._id, token: token, message: `Welcome ${foundUser.firstName}`})
            } else {
                return res.status(402).json({ message: "Email or Password is incorrect" });
            }
        })
        .catch((err) => {
            console.log(err)
        })
})









router.get("/verify", isAuthenticated, (req, res) => {

    User.findOne({_id: req.user._id})
        .populate('posts')
        .populate('reviews')
        .then((foundUser) => {
            const payload = { ...foundUser };
            delete payload._doc.password;

            res.status(200).json(payload._doc);
        })
        .catch((err) => {
            console.log(err)
        })
});





module.exports = router;