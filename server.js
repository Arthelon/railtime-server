const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const bodyparser = require("body-parser")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")
dotenv.config()

mongoose.Promise = Promise

/**
 * Middleware
 */
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

/**
 * Routes
 */
const apiBaseRoute = require("./routes/api")
const jobApiRoute = require("./routes/jobs")
const stationApiRoute = require("./routes/stations")
const userApiRoute = require("./routes/users")
const responseApiRoute = require("./routes/responses")
app.use("/api/jobs", jobApiRoute)
app.use("/api/stations", stationApiRoute)
app.use("/api/users", userApiRoute)
app.use("/api/responses", responseApiRoute)
app.use("/api", apiBaseRoute)

/**
 * Error handlers
 */
app.use(function (req, res, next) { //Forward 404 request to handlers
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    if (err.status == 404) {
        res.sendStatus(404)
    } else {
        next(err)
    }
})
app.use(function (err, req, res, next) {
    res.sendStatus(err.status || 500);
    console.log(err)
});

/**
 * Mongoose setup
 */
mongoose.connect(process.env.MONGO_URL, function(err) {
    if (err) throw err
})
mongoose.connection.on("error", console.error.bind(console, 'connection error:'))

server.listen(process.env.PORT, err => {
    if (err) {
        console.log("Error binding to port:")
        console.log(err)
    } else {
        console.log(`Server listening on port: ${process.env.PORT}`)
    }
})