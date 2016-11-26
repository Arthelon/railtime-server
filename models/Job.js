const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema({
    content: {type: String, required: true},
    images: [String],
    type: {type: String, enum: ["selection", "normal", "validate", "spam"], default: "normal"}
})

const Job = mongoose.model("Job", JobSchema)

module.exports = Job