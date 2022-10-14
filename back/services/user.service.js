const User = require('../models/User')

const save = async (email, hash) => {
    const user = new User({
        email,
        password: hash,
    })

    return user.save()
}

const findUser = async (email) => {
    return User.findOne({ email })
}

module.exports = { save, findUser }
