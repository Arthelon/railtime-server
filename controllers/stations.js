const { Station } = require("../models")

const maxDistance = 200
const minDistance = 0

function getNearestStation(lat, lng) {
    return Station.findOne({
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
    })
}

exports.getNearestStation = getNearestStation