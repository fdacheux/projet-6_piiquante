const fs = require('fs')

const unlinkImage = async (sauceUrl) => {
    const path = sauceUrl.split('/images/')[1]

    return fs.unlink(`images/${path}`, (error) => {
        if (error) {
            throw new Error(error.message)
        }
    })
}

module.exports = unlinkImage
