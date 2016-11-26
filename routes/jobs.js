const router = require("express").Router()
const { Job, Response, User } = require("../models")
const peaks = require("./peaks.json")
const mean = require("./mean.json")
const jobUtils = require("../controllers/jobs")
const baseXP = 10

function toNearest30(hours, minutes) {
    var m = (parseInt((minutes + 15)/30) * 30) % 60;
    var h = minutes >= 30 ? (hours === 23 ? 0 : ++hours) : hours;
    return new Date(2016, 21, 11, h, m)
}

router.get("/", (req, res, next) => {
    Job.count().then(count => {
        const randOffset = Math.floor(Math.random() * count)
        return Job.findOne().skip(randOffset)
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

/**
 * userId: Number
 * value: 
 */
router.post("/:jobId", (req, res, next) => {
    const { jobId } = req.params
    const { userId, value } = req.body
    User.findOne({
        _id: userId
    }).populate("startStation").then(user => {
        if (!user) {
            next(new Error("User not found!"))
        } else {
            const stationId = String(user.startStation.stationId)
            const currDate = new Date()
            const currentLevel = peaks[stationId][toNearest30(currDate.getHours(), currDate.getMinutes())]
            let bonusXP = baseXP 
            if (typeof currentLevel !== "undefined") {
                bonusXP *= (1 / (currentLevel / (mean[stationId] + 100) ))
            }
            return Promise.resolve(Math.round(bonusXP, 10))
        }
    }).then(bonusXP => {
        console.log(bonusXP)
        const createResponse = Response.create({
            userId,
            value,
            jobId
        })
        jobUtils.handleJobSubmit(jobId, value)
        const addExp = User.findOneAndUpdate({
            _id: userId
        }, {
            $inc: {
                xp: bonusXP
            }
        })
        
        Promise.all([createResponse, addExp]).then(resp => {
            if (!resp[1]) {
                next(new Error("User not found!"))
            }
            res.json({
                success: true,
                message: "Job submission successful",
                data: resp[1].xp + bonusXP
            })
        }).catch(err => {
            next(err)
        })
    }).catch(err => {
        next(err)
    })
})

module.exports = router