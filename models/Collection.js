const mongoose = require("mongoose");

const CollectionModel = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Collection = mongoose.model("Collection", CollectionModel);
module.exports = Collection;