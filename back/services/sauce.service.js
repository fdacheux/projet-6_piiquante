const Sauce = require('../models/Sauce');

const getSauce = async (sauceId) => {
  const sauce = await Sauce.findOne( { _id: sauceId } )
  return sauce;
}

const saveSauce = async (sauce) => {
  return await sauce.save()
}

const addLike = async (userId, sauceId) => {
    await Sauce.updateOne(
      { _id: sauceId  },
      { $addToSet: { usersLiked: userId} }
    )
    
  }

const addDislike = async (userId, sauceId) => {
    await Sauce.updateOne(
      { _id: sauceId  },
      { $addToSet: { usersDisliked: userId} }
    )
    
}

const removeLikeDislike = async (userId, sauceId) => {
  await Sauce.updateOne( { _id: sauceId }, { $pull: { usersLiked: userId, usersDisliked: userId } } )
}

// const spliceId = (userId, usersLiked, usersDisliked) => {
//   if(usersLiked.includes(userId)){
//     usersLiked.splice(usersLiked.indexOf(userId));
//   }
//     usersDisliked.splice(usersDisliked.indexOf(userId), 1) ;
// }

module.exports =  {
  getSauce,
  saveSauce,
  addLike,
  addDislike,
  removeLikeDislike
}
  