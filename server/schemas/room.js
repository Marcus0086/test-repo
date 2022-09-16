const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    id: String,
    users: []
});

module.exports = new mongoose.model("Room", roomSchema);