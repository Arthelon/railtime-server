const router = require("express").Router()
const Station = require("../models").Station

const minDistance = 0
const maxDistance = 100

/**
 * Params:
 *  lat: Number
 *  lng: Number
 */
router.get("/coords", (req, res, next) => {
    const { lat, lng } = req.query
    console.log(lat)
    console.log(lng)
    if (!lat || !lng) {
        res.status(400).json({
            success: false,
            message: "Invalid query params"
        })
    } else {
        Station.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [ lng, lat ]
                    },
                    $maxDistance: maxDistance,
                    $minDistance: minDistance
                }
            }
        }).then(station => {
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
        }).catch(err => {
            next(err)
        })
    }
})

router.get("/:stationId", (req, res, next) => {
    const { stationId } = req.params
    Station.findOne({
        stationId
    }).then(job => {
        if (job) {
            res.json({
                success: true,
                data: job
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