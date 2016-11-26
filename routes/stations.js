const router = require("express").Router()
const { Station, User } = require("../models")
const stationUtils = require("../controllers/stations")

/**
 * Params:
 *  lat: Number,
 *  lng: Number
 */
router.get("/coords", (req, res, next) => {
    const { lat, lng } = req.query
    if (!lat || !lng) {
        res.status(400).json({
            success: false,
            message: "Invalid body params"
        })
    } else {
        stationUtils.getNearestStation(lat, lng)
        .then(station => {
            if (station) {
                res.json({
                    success: true,
                    data: station
                })
            } else {
                res.json({
                    success: false,
                    message: "No stations found"
                })
            }
        })
    }
})

/**
 * Body:
 *  lat: Number
 *  lng: Number
 *  userId: String
 */
router.post("/coords", (req, res, next) => {
    const { lat, lng, userId } = req.body
    if (!lat || !lng || !userId) {
        res.status(400).json({
            success: false,
            message: "Invalid body params"
        })
    } else {
        stationUtils.getNearestStation(lat, lng)
        .then(station => {
            if (station) {
                User.findOneAndUpdate({
                    _id: userId
                }, {
                    startStation: station._id
                }).catch(err => {
                    console.log(err)
                })
                res.json({
                    success: true,
                    data: station
                })
            } else {
                res.json({
                    success: false,
                    message: "No stations found"
                })
            }
        }).catch(err => {
            next(err)
        })
    }
})

/**
 * 
 */
router.get("/crowd/:stationId", (req, res, next) => {
    const { stationId } = req.params

    Station.findOne({
        stationId
    }).then(station => {
        if (!station) {
            res.json({
                success: false,
                message: "No station found"
            })
        } else {
            res.json({
                success: true,
                message: "Retrieved crowd levels from station",
                data: station.crowd
            })
        }
    }).catch(err => {
        next(err)
    })
})

router.get("/:stationId", (req, res, next) => {
    const { stationId } = req.params
    Station.findOne({
        stationId
    }).then(station => {
        if (station) {
            res.json({
                success: true,
                data: station
            })
        } else {
            res.json({
                success: false,
                message: "No station found"
            })
        }
    }).catch(err => {
        next(err)
    })
})

router.get("/", (req, res, next) => {
    Station.find({}).then(stations => {
        res.json({
            success: true,
            data: stations
        })
    }).catch(err => {
        next(err)
    })
})

module.exports = router