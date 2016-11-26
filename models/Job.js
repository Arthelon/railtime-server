const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema({
    content: {type: String, required: true},
    imageUrl: String
})

const Job = mongoose.model("Job", JobSchema)

module.exports = Job