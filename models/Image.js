const mongoose = require("mongoose");

const ImageModel = new mongoose.Schema({
    collection_id: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    }
});

const Image = mongoose.model("Image", ImageModel);
module.exports = Image;