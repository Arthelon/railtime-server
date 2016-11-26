const mongoose = require("mongoose")

const ResponseSchema = new mongoose.Schema({
    jobId: {type: mongoose.SchemaTypes.ObjectId, ref: "Job"},
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: "User"},
    timestamp: {type: Date, default: Date.now},
    value: {type: mongoose.SchemaTypes.Mixed}
})

const Response = mongoose.model("Response", ResponseSchema)

module.exports = Response