const router = require("express").Router()
const User = require("../models").User

router.get("/", (req, res, next) => {
    User.find({}).then(users => {
        if (!users) {
            res.json({
                success: false,
                message: "No users found!"
            })
        } else {
            res.json({
                success: true,
                data: users
            })
        }
    }).catch(err => {
        next(err)
    })
})

module.exports = router