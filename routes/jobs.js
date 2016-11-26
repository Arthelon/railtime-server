const router = require("express").Router()
const Job = require("../models").Job

router.get("/", (req, res, next) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10
    Job.count().then(count => {
        const randOffset = Math.floor(Math.random() * count)
        return Job.findOne().skip(randOffset).limit(limit)
    }).then(jobs => {
        if (jobs === null || jobs.length === 0) {
            res.json({
                success: true,
                message: "No jobs found!",
                data: []
            })
        } else {
            res.json({
                success: true,
                data: jobs
            })
        }
    }).catch(err => {
        next(err)
    })
})

router.post("/:jobId", (req, res) => {
    const { jobId } = req.params
    res.json({
        success: true
    })
})

module.exports = router