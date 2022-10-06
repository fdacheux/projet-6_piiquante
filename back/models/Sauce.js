const mongoose = require('mongoose');

const modelsSauce = mongoose.Schema({
    userId: { type: String, required: true},
    name: { type: String, required: true },
    manufacturer : { type: String, required: true},
    description: { type: String, required: true},
    mainPepper: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, default: 0}, 
    dislikes : { type: Number, default: 0} , 
    usersLiked : { type: Array },
    usersDisliked : { type: Array}
})



// modelsSauce.virtual('likes').get(function() {
//     return this.usersLiked?.length
// });

// modelsSauce.virtual('dislikes').get(function() {
//     return this.usersDisliked?.length
// });

module.exports = mongoose.model('sauce', modelsSauce);
