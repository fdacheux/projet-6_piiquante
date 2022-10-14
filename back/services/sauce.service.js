const Sauce = require('../models/Sauce')

const getSauces = async () => {
    return Sauce.find()
}

const getSauce = async (sauceId) => {
    return Sauce.findOne({ _id: sauceId })
}

const saveSauce = async (sauce) => {
    return sauce.save()
}

const updateSauce = async (sauceId, sauceObject) => {
    return Sauce.updateOne({ _id: sauceId }, { ...sauceObject, _id: sauceId })
}

const deleteSauce = async (sauceId) => {
    return Sauce.deleteOne({ _id: sauceId })
}

const addLike = async (userId, sauceId) => {
    return Sauce.updateOne(
        { _id: sauceId, usersDisliked: { $ne: userId } },
        { $addToSet: { usersLiked: userId } }
    )
}

const addDislike = async (userId, sauceId) => {
    return Sauce.updateOne(
        { _id: sauceId, usersLiked: { $ne: userId } },
        { $addToSet: { usersDisliked: userId } }
    )
}

const removeLikeDislike = async (userId, sauceId) => {
    return Sauce.updateOne(
        { _id: sauceId },
        { $pull: { usersLiked: userId, usersDisliked: userId } }
    )
}

module.exports = {
    getSauces,
    getSauce,
    saveSauce,
    updateSauce,
    deleteSauce,
    addLike,
    addDislike,
    removeLikeDislike,
}
