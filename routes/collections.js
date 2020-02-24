const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const stream = require("stream");
const Resize = require("./twitter/Resize");
const upload = require("./twitter/uploadMiddleware");

//Connect To MongoDb
mongoose
    .connect("mongodb+srv://redus:redis06122002!@cluster0-xwsm9.mongodb.net/test?retryWrites=true&w=majority", {  useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {console.log("Connected to MongoDB")})
    .catch(e => console.log(e));

//Models
const Collections = require("../models/Collection");
const Image = require("../models/Image");

//Get CollecionImages Information
router.get("/images/:c_id", (req, res) => {
    Image.find({collection_id: req.params.c_id}, (err, d) => {
        if(err) {
            res.json({res: "False"});
        } else {
            res.json(d);
        }
    })
})

//Get Image Data
router.get("/image/:name", (req, res) => {
    const r = fs.createReadStream('./images/' + req.params.name) // or any other way to get a readable stream
    const ps = new stream.PassThrough() // <---- this makes a trick with stream error handling
    stream.pipeline(
    r,
    ps, // <---- this makes a trick with stream error handling
    (err) => {
        if (err) {
        return res.sendStatus(400); 
        }
    })
    ps.pipe(res) // <---- this makes a trick with stream error handling
});

//Get Collections
router.get("/", (req, res) => {
    Collections.find({})
        .then(d => {
            res.json(d);
        });
});

//Get Users Collections
router.get("/:user_id", (req, res) => {
    Collections.find({user_id: req.params.user_id}, (err, d) => {
        if(err) {
            res.json([]);
        } else {
            res.json(d);
        }
    })
})

//Add Collection
router.post("/add", (req, res) => {
    const collection = new Collections();
    collection.user_id = req.body.user_id;
    collection.name = req.body.name;
    collection.save(err => {
        if(err) {
            console.log(err)
            res.json({res: "False"});
        } else {
            res.json({res: collection._id});
        }
    });   
});

//Delete Collection
router.get("/delete/:id", (req, res) => {
    const _id = req.params.id;
    Collections.deleteOne({_id}, (err) => {
        if(err) {
            res.json({res: "False"});
        } else {
            res.json({res: "True"});
        }
    })
})

//Upload Image
router.post("/image/add/:collection_id", upload.single("image"), async (req, res) => {
    const imagePath = './images';
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    const image = new Image();
    image.collection_id = req.params.collection_id;
    image.path = filename;
    image.save(err => {
        if(err) {
            res.json({res: "False"});
        } else {
            return res.status(200).json({ name: filename });
        }
    }) 
})


module.exports = router;