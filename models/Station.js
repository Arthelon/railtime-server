const mongoose = require("mongoose")

const StationSchema = new mongoose.Schema({
    lat: {type: Number, required: true},
    lng: {type: Number, required: true},
    name: {type: String, required: true}
})

const Station = mongoose.model("Station", StationSchema)
module.exports = Station