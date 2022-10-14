const jsonWebToken = require('jsonwebtoken')

const sessionIds = (userId) => {
    return {
        userId,
        token: jsonWebToken.sign({ userId: userId }, 'RANDOM_TOKEN_SECRET', {
            expiresIn: '24h',
        }),
    }
}

module.exports = sessionIds
