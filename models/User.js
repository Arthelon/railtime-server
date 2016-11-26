const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    xp: {type: Number, default: 0},
    rank: {type: Number, default: 1}
})

const User = mongoose.model("User", UserSchema)

module.exports = User