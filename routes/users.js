const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Connect To MongoDb
mongoose
    .connect("mongodb+srv://redus:redis06122002!@cluster0-xwsm9.mongodb.net/test?retryWrites=true&w=majority", {  useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {console.log("Connected to MongoDB")})
    .catch(e => console.log(e));

//Models
const User = require("../models/User");

//Create user
router.post("/create", (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({username, email})
        .then(user => {
            if(user) {
                res.json({res: "False"});
            } else {
                const newUser = new User({username, email, password});
                newUser
                    .save()
                    .then(user => {
                        res.json({res: "True"});
                    })
                    .catch(err => {
                        res.json({msg: "False"});
                    });
            }
        })
})

//Get User Email
router.get("/email/:username", (req, res) => {
    User.findOne({username: req.params.username}, (err, data) => {
        if(err) {
            res.json({res: "False"});
        } else {
            res.json({email: data.email})
        }
    })
});

//Update Username
router.get("/change/email/:username/:new_username", (req, res) => {
    const username = req.params.username;
    const new_username = req.params.new_username;
    User.findOne({email: new_username})
        .then(d => {
            if(d) {
                res.json({res: "False"});
            } else {
                //Update
                User.updateOne({email: username}, {email: new_username})
                    .then(d => {
                        res.json({res: "True"});
                    })
            }
        })
})

//Log In
router.get('/login/:username/:password', (req, res) => {
    const username = req.params.username;
    const password = req.params.password;

    User.findOne({ username, password })
        .then(user => {
            if(user) {
                res.json({res: "True"});
            } else {
                res.json({res: "False"});
            }
        })
});

module.exports = router;