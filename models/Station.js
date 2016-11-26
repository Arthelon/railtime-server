const mongoose = require("mongoose")

const StationSchema = new mongoose.Schema({
    location: { 
        type: {type: String, enum: "Point", default: "Point"}, 
        coordinates: { type: [Number], default: [0,0]}
    },
    name: {type: String, required: true},
    stationId: {type: Number, required: true},
    crowd: {type: [{type: Number, min: 1, max: 5}], required: true}
})

StationSchema.index({location: "2dsphere"})
StationSchema.virtual("name_normalized").get(function() {
    return this.name.toLowerCase().split(" ").join("_")
})
StationSchema.set("toObject", {getters: true, virtuals: true})

const Station = mongoose.model("Station", StationSchema)
module.exports = Station