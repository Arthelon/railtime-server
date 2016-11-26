const router = require("express").Router()
const { Response } = require("../models")

router.get("/", (req, res, next) => {
    Response.find({})
        .populate("jobId")
        .then(resp => {
            console.log(resp)
            res.json({
                success: true,
                data: resp || []
            })
        }).catch(err => {
            next(err)
        })
})

module.exports = router