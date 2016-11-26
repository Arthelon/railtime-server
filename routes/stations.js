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
        res.sendStatus(400)
    } else {
        stationUtils.getNearestStation(lat, lng)
        .then(station => {
            if (station) {
                res.json(station)
            } else {
                res.json({})
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
        res.sendStatus(400)
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
                res.json(station)
            } else {
                res.json({})
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
            res.sendStatus(400)
        } else {
            res.json(station.crowd)
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
            res.json(station)
        } else {
            res.sendStatus(400)
        }
    }).catch(err => {
        next(err)
    })
})

router.get("/", (req, res, next) => {
    Station.find({}).then(stations => {
        res.json(stations)
    }).catch(err => {
        next(err)
    })
})

module.exports = router