const mongoose = require('mongoose')

const modelsSauce = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    usersLiked: { type: Array },
    usersDisliked: { type: Array },
})

modelsSauce.set('toObject', { virtuals: true })
modelsSauce.set('toJSON', { virtuals: true })

modelsSauce.virtual('likes').get(function () {
    return this.usersLiked?.length
})

modelsSauce.virtual('dislikes').get(function () {
    return this.usersDisliked?.length
})

module.exports = mongoose.model('sauce', modelsSauce)
