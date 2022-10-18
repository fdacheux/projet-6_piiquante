const {
    hashPassword,
    compareHashedPasswords,
} = require('../helper/user.helper')

const User = require('../models/User')
const { save, findUser } = require('../services/user.service')
const sessionIds = require('../mapper/user.mapper')

exports.signup = async (req, res, _next) => {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (req.body.password.match(regex)) {
        try {
            const hash = await hashPassword(req.body.password)

            if (hash) {
                await save(req.body.email, hash)
                res.status(201).json({ message: 'User successfully created.' })
            }
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    } else {
        res.status(400).json({
            message:
                'Password must contain at least 8 chararcters, at least one uppercase letter, one lowercase letter, one number and one special character',
        })
    }
}

exports.login = async (req, res, _next) => {
    try {
        const user = await findUser(req.body.email)

        if (user === null) {
            res.status(401).json({
                message: 'Invalid email address/password combination',
            })
        } else {
            const valid = await compareHashedPasswords(
                req.body.password,
                user.password
            )

            if (!valid) {
                res.status(401).json({
                    message: 'Invalid email address/password combination',
                })
            }

            res.status(200).json(sessionIds(user._id))
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
