const express = require('express')
const router = express.Router()
const { loginAttemptsLimiter, signupLimiters }  = require('../middleware/rateLimiter')
const userCtrl = require('../controllers/user')

router.post('/signup', signupLimiters, userCtrl.signup)
router.post('/login', loginAttemptsLimiter, userCtrl.login)

module.exports = router
