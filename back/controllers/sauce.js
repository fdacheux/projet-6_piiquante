const Sauce = require('../models/Sauce');
const { getSauce, 
        addLike, 
        addDislike, 
        removeLikeDislike, 
        saveSauce, 
        getSauces, 
        updateSauce, 
        deleteSauce} = require('../services/sauce.service');
const unlinkImage = require('../helper/sauce.helper');
const toSauce = require('../mapper/sauce.mapper');

exports.createSauce = async (req, res, next) => {  
    
    if (req.fileValidationError) {
      res.status(415).json({ message: {message:req.fileValidationError}})
    } else if (!req.file || req.auth.userId) {
      res.status(400).json( {message : 'Image is missing'} );
    } else {
      const sauce = 
      new Sauce( 
        toSauce(
          req.body.sauce,
          `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          req.auth.userId
        ))
    
      try { 
          await saveSauce(sauce);
          res.status(201).json({ message: 'New sauce object successfully saved !'}) 
        }
      catch(error) { 
          res.status(400).json( {message : error.message} ) 
        }
    }
}

exports.getAllSauces = async (req, res, next) => {
  
  try {
    const sauces = await getSauces();
    res.status(200).json(sauces)
  } 
  catch(error) {
    res.status(400).json( {message : error.message} ); 
  }
}

exports.getOneSauce = async (req, res, next) => {
  try {
    const sauce = await getSauce(req.params.id);
    res.status(200).json(sauce)
  } 
  catch(error) { 
    res.status(404).json( {message : error.message} ) 
  }
}

exports.modifySauce = async (req, res, next) => {

  if(req.fileValidationError){
    res.status(415).json({ message: {message:req.fileValidationError}})
  } else { 
    const sauceObject = req.file ? 
            toSauce(req.body.sauce, `${req.protocol}://${req.get('host')}/images/${req.file.filename}`) :
            toSauce(req.body)
    
    delete sauceObject._userId;
    try{

      const sauce = await getSauce(req.params.id);

      if(sauce.userId != req.auth.userId){
        res.status(403).json( { message : error.message} )
      } else {
        req.file && await unlinkImage( sauce.imageUrl)
          
          try{
            await updateSauce(req.params.id, sauceObject)
            res.status(200).json( {message: 'Sauce successfully updated !'});
          }
          catch(error){ 
            res.status(401).json( {message : error.message} );
          }

        }
      }
    catch(error){
        res.status(400).json({ message : error.message });
    }
  }
}


exports.likeSauce = async (req, res, next) => {
  try {
    const like = req.body.like;
    const userId = req.auth.userId;
    const sauceId = req.params.id;
    
    if(! await getSauce(req.params.id)){
      res.status(404).json( {message : 'Sauce not found'} )
    }

    else {  
      try {
  
        switch (like){
          case 1 : 
            const {modifiedCount: likesModified} = await addLike(userId, sauceId);
            if(likesModified > 0){
              res.status(200).json('Like successfully added !')
            }else{
              res.status(400).json({message:'You are not authorized to add a like to this sauce'})
            }
            break;
          case -1 : 
            const {modifiedCount:dislikesModified} = await addDislike(userId, sauceId);
            if(dislikesModified > 0){
              res.status(200).json('Dislike successfully added !')
            }else{
              res.status(400).json({message:'You are not authorized to add a dislike to this sauce'})
            }
            break;
          case 0 : 
            const {modifiedCount:dislikesLikesRemoved} = await removeLikeDislike(userId, sauceId);
            if(dislikesLikesRemoved > 0){
              res.status(200).json('Like/dislike successfully removed !')
            }else{
              res.status(400).json({message:'You are not authorized to remove a dislike or like to this sauce'})
            }
            break;
          default : 
            throw new Error({message : 'Like format not recognized'});
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

exports.deleteSauce = async (req, res, next) => {
  try{
    const sauce = await getSauce(req.params.id);
    if(!sauce){
      res.status(404).json( {message : 'Sauce not found'} )
    }
    else if(sauce.userId != req.auth.userId){
      res.status(403).json( { message: 'Unauthorized request'} )
    } else {
        try {
          await deleteSauce(req.params.id);
          await unlinkImage(sauce.imageUrl);
           res.status(200).json( { message: 'Sauce obect successfully deleted !'})
        }
        catch(error) {
          res.status(401).json( { message : error.message });
        };
    }
  }
  catch( error){
    res.status(500).json({ message : error.message });
  }
} 

//exports.methodName = (req, res, next) => { what it does (create, read, update, delete) + errors handling }