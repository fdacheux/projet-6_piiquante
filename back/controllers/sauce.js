const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce =  (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject._userId;    
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
      .then(() => { res.status(201).json({ message: 'Objet enregistré !'}) })
      .catch(error => { res.status(400).json( {error} ) });
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json( {error} ));
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json( {error} ));
}

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  
  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // console.log(req.file)
      const path = sauce.imageUrl.split('/images/')[1];
      console.log(sauce.imageUrl);
      console.log(path)
      // if(req.file) {
      //   fs.unlink(`images/${path}`);
      // }
      if(sauce.userId != req.auth.userId){
        res.status(403).json( { message: 'unauthorized request' } )
      } else {
        Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json( {message: 'Sauce modifiée.'}))
          .catch(error => res.status(401).json( {error} ));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
}



exports.likeSauce = (req, res, next) => {
  Sauce.findOne( { _id: req.params.id } )
  .then(sauce => {
    const hasAlreadyLikedDisliked = (sauce.usersLiked.includes(req.auth.userId) || sauce.usersDisliked.includes(req.auth.userId));
    const updateLikesOrDislikes = (hadLiked) => {
      if (req.body.like === 1 || (req.body.like === 0 && hadLiked)) {
        Sauce.updateOne({ _id: req.params.id }, { likes: sauce.likes, usersLiked: sauce.usersLiked,  _id: req.params.id})
          .then(() => res.status(200).json( {message: 'Like modifié'}))
          .catch(error => res.status(401).json( {error} ))
      } else if (req.body.like === -1 || (req.body.like === 0 && !hadLiked)){
        Sauce.updateOne({ _id: req.params.id }, { dislikes: sauce.dislikes, usersDisliked: sauce.usersDisliked,  _id: req.params.id})
          .then(() => res.status(200).json( {message: 'Dislike modifié'}))
          .catch(error => res.status(401).json( {error} ));
      } else {
        error();
      }
    }

    let hadLiked = true;
    if(req.body.like === 1 && !hasAlreadyLikedDisliked){
      sauce.likes += 1;
      sauce.usersLiked.push(req.auth.userId);
    } else if(req.body.like === -1 && !hasAlreadyLikedDisliked){
      sauce.dislikes += 1;
      sauce.usersDisliked.push(req.auth.userId)
    } else if (req.body.like === 0 && hasAlreadyLikedDisliked){
      const removeLike = () => {
        sauce.likes -= 1;
        const userIndex = sauce.usersLiked.findIndex(element => element === req.auth.userId);
        sauce.usersLiked.splice(userIndex, 1);
        return hadLiked
      }
      const removeDislike = () => {
        sauce.dislikes -= 1;
        const userIndex = sauce.usersDisliked.findIndex(element => element === req.auth.userId);
        sauce.usersDisliked.splice(userIndex, 1);
        hadLiked = false;
        return hadLiked
      }
      sauce.usersLiked.includes(req.auth.userId)? removeLike():removeDislike();
    }
    updateLikesOrDislikes(hadLiked)

  })
  .catch((error) => {
    res.status(400).json({ error });
  })
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne( { _id: req.params.id } )
    .then(sauce => {
        if(sauce.userId != req.auth.userId){
          res.status(403).json( { message: 'unauthorized request'} )
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => { res.status(200).json( { message: 'Objet supprimé !'})})
              .catch(error => res.status(401).json( { error }));
          });
        }
    })
    .catch( error => {
      res.status(500).json({ error });
    })
} 

//exports.methodName = (req, res, next) => { what it does (create, read, update, delete) + errors handling }