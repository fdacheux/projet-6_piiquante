const Sauce = require('../models/Sauce');
const fs = require('fs');
const { getSauce, addLike, addDislike, removeLikeDislike, saveSauce } = require('../services/sauce.service')

exports.createSauce = async (req, res, next) => {  
    
    if (req.fileValidationError) {
      res.status(415).json({ message: {message:req.fileValidationError}})
    } else {
      const sauceObject = JSON.parse(req.body.sauce)
      delete sauceObject._id;
      delete sauceObject._userId;    
      const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      });

      try { 
          await saveSauce(sauce);
          res.status(201).json({ message: 'Objet enregistré !'}) 
        }
        catch(error) { 
          res.status(400).json( {message : error.message} ) 
        }
    }
}

exports.getAllSauces = async (req, res, next) => {
  
  try {
    const sauces = await Sauce.find()
    res.status(200).json(sauces)
  }
  catch(error) {
    res.status(400).json( {message : error.message} );
  }
}

exports.getOneSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id })
    res.status(200).json(sauce)
  } 
  catch(error) { 
    res.status(404).json( {message : error.message} ) 
  }
}

exports.modifySauce = (req, res, next) => {

  if(req.fileValidationError){
    res.status(415).json({ message: {message:req.fileValidationError}})
  } else { 
    const sauceObject = req.file ? { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if(sauce.userId != req.auth.userId){
          res.status(403).json( { message : error.message} )
        } else {
          const path = sauce.imageUrl.split('/images/')[1];
          if(req.file) {
              fs.unlinkSync(`images/${path}`, (err) => {
                if (err) {
                  throw err;
                }
              });
          }
          Sauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json( {message: 'Sauce modifiée.'}))
            .catch(error => res.status(401).json( {message : error.message} ));
        }
      })
      .catch((error) => {
        res.status(400).json({ message : error.message });
      })
  }
}


exports.likeSauce = async (req, res, next) => {
  try {
    const like = req.body.like;
    const userId = req.auth.userId;
    const sauceId = req.params.id;
    
    if(!getSauce(req.params.id)){
      res.status(404).json( {message : 'sauce not found'} )
    }

    else {  
      try {
  
        switch (like){
          case 1 : 
            await addLike(userId, sauceId);
            res.status(200).json('Like successfully added !')
            break;
          case -1 : 
            await addDislike(userId, sauceId);
            res.status(200).json('Dislike successfully added !')
            break;
          case 0 : 
            await removeLikeDislike(userId, sauceId)
            res.status(200).json('Like/dislike successfully removed !')
            break;
          default : 
            throw new Error({message : 'like format not recognized'});
        }
        
      }
      catch (error){
        res.status(400).json( {message : error.message} )
      }
    }
  }
  catch(error) {
    res.status(500).json( {message : error.message} )
  }
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