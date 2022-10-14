const bcrypt = require('bcrypt')
const {
    hashPassword,
    compareHashedPasswords,
} = require('../helper/user.helper')

const User = require('../models/User')
const { save, findUser } = require('../services/user.service')
const sessionIds = require('../mapper/user.mapper')

exports.signup = async (req, res, next) => {
    let hash

    try {
        hash = await hashPassword(req.body.password)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

    if (hash) {
        try {
            await save(req.body.email, hash)
            res.status(201).json({ message: 'User successfully created.' })
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await findUser(req.body.email)

        if (user === null) {
            res.status(401).json({
                message: 'Invalid email address/password combination',
            })
        } else {
            let valid

            try {
                valid = await compareHashedPasswords(
                    req.body.password,
                    user.password
                )
            } catch (error) {
                res.status(500).json({ message: error.message })
            }
            if (!valid) {
                res.status(401).json({
                    message: 'Invalid email address/password combination',
                })
            } else {
                res.status(200).json(sessionIds(user._id))
            }
        }
    } catch {
        res.status(500).json({ message: error.message })
    }
}
