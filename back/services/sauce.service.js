const Sauce = require('../models/Sauce');

const addLike = async (userId, sauceId, usersLiked, usersDisliked, res) => {
    if(await usersLiked.includes(userId) || await usersDisliked.includes(userId) ){
      throw new Error({message : 'Already liked/disliked'});
    } else {
      usersLiked.push(userId)
      await Sauce.updateOne(
        { _id: sauceId  },
        { $addToSet: { usersLiked: userId},  likes : usersLiked.length }
     )
      res.status(200).json('Like ajouté avec succès !')
    }
  }


const addDislike = async (userId, sauceId, usersLiked, usersDisliked, res) => {
    if(await usersLiked.includes(userId) || await usersDisliked.includes(userId) ){
      throw new Error({message : 'Already liked/disliked'});
    } else {
      usersDisliked.push(userId)
      await Sauce.updateOne(
        { _id: sauceId  },
        { $addToSet: { usersDisliked: userId},  dislikes : usersDisliked.length }
     )
      res.status(200).json('Dislike ajouté avec succès !')
    }
}

const removeLikeDislike = async (userId, sauceId, usersLiked, usersDisliked, res) => {
  await usersLiked.includes(userId) || usersDisliked.includes(userId) ?
    spliceId(userId, usersLiked, usersDisliked) : Error({message : 'Unauthorized'});
  await Sauce.updateOne( { _id: sauceId }, { $pull: { usersLiked: userId, usersDisliked: userId }, likes : usersLiked.length, dislikes : usersDisliked.length } )
  res.status(200).json('Like/dislike retiré avec succès !')
}

const spliceId = (userId, usersLiked, usersDisliked) => {
  if(usersLiked.includes(userId)){
    usersLiked.splice(usersLiked.indexOf(userId));
  }
    usersDisliked.splice(usersDisliked.indexOf(userId), 1) ;
}

module.exports =  {
  addLike,
  addDislike,
  removeLikeDislike
}
  