const mongoose = require("mongoose")

const ResponseSchema = new mongoose.Schema({
    jobId: {type: mongoose.SchemaTypes.ObjectId, ref: "Job"},
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    value: {type: String},
})

const Response = mongoose.model("Response", ResponseSchema)

module.exports = Response