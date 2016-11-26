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

router.get("/:offset", (req, res, next) => {
    let { offset } = req.params
    Job.count().then(count => {
        if (offset >= count) {
            offset = 0
        }
        return Job.findOne().sort({question: 1}).skip(offset)
    }).then(jobs => {
        offset += 1
        if (jobs === null || jobs.length === 0) {
            res.json([])
        } else {
            res.json(jobs)
        }
    }).catch(err => {
        next(err)
    })
})

/**
 * userId: Number
 * value: Any
 * 
 */
router.post("/:jobId/:time", (req, res, next) => {
    const { jobId, time } = req.params
    const { userId, value } = req.body
    Job.findOne({
        _id: jobId
    }).then(job => {
        if (!job) {
            throw new Error("Job not found")
        } else {
            return User.findOne({
                _id: userId
            }).populate("startStation")
        }
    }).then(user => {
        console.log(user)
        if (!user) {
            next(new Error("User not found!"))
        } else {
            const stationId = String(user.startStation.stationId)
            const currDate = new Date(time) || new Date()
            const currentLevel = peaks[stationId][toNearest30(currDate.getHours(), currDate.getMinutes())]
            console.log(currentLevel)
            let multiplier = 1
            if (typeof currentLevel !== "undefined") {
                multiplier = (1 / (currentLevel / (mean[stationId] + 100 / currentLevel) ))
            }
            const bonusXP = multiplier * baseXP
            return Promise.resolve([Math.round(bonusXP, 10), multiplier])
        }
    }).then(data => {
        const bonusXP = data[0]
        const multiplier = data[1]
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
                totalXP: resp[1].xp + bonusXP,
                bonusXP,
                multiplier
            })
        }).catch(err => {
            next(err)
        })
    }).catch(err => {
        next(err)
    })
})

module.exports = router