const { Job } = require("../models")


/**
 * Job types:
 *  - normal: 
 *      - in: One, out: String
 *  - selection:
 *      - in: Many, out: [String]
 *  - validate:
 *      - in: Many, out: Boolean
 */

function handleJobSubmit(jobId, value) {
    Job.findOne({
        _id: jobId
    }).then(job => {
        console.log(job)
    }).catch(err => {
        console.log(err)
    })
}

exports.handleJobSubmit = handleJobSubmit