const User = require('../models/User')

const save = async (email, password) => {
    const user = new User({
        email,
        password,
    })

    return user.save()
}

const findUser = async (email) => {
    return User.findOne({ email })
}

module.exports = { save, findUser }
