const router = require("express").Router()
const User = require("../models").User

router.get("/", (req, res, next) => {
    User.find({}).then(users => {
        if (!users) {
            res.sendStatus(400)
        } else {
            res.json(users)
        }
    }).catch(err => {
        next(err)
    })
})

module.exports = router