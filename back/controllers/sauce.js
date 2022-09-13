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
//exports.methodName = (req, res, next) => { what it does (create, read, update, delete) + errors handling }