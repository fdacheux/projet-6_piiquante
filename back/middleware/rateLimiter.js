const rateLimit = require('express-rate-limit')

const requestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, //Limit each IP to 100 requests per windowMs
    handler: (req, res, next, options) =>
        res.status(options.statusCode).send(options.message),
})

const loginAttemptsLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 15, //Limit each IP to 100 requests per windowMs
    handler: (req, res, next, options) =>
        res.status(options.statusCode).send(options.message),
})

const signupLimiters = rateLimit({
    windowMs: 120 * 60 * 1000, // 2 heures
    max: 5, //Limit each IP to 5 signups per windowMs
    handler: (req, res, next, options) =>
		res.status(options.statusCode).send(options.message),

})

module.exports = { requestLimiter, loginAttemptsLimiter, signupLimiters}