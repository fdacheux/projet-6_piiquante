const bcrypt = require('bcrypt')

const hashPassword = async (password) => bcrypt.hash(password, 10)
const compareHashedPasswords = async (reqPassword, userPassword) =>
    bcrypt.compare(reqPassword, userPassword)

module.exports = { hashPassword, compareHashedPasswords }
