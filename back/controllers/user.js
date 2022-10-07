const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const hashPassword = require('../helper/user.helper');

const User = require('../models/User');
const save = require('../services/user.service');

exports.signup = async (req, res, next) => {

    let hash

    try {
        hash = await hashPassword(req.body.password)
    } catch(error){
        res.status(500).json( {message : error.message} );
    }

    if(hash){
        try{
            await save(req.body.email,hash)
            res.status(201).json( {message: "Nouvel utilisateur ajouté"} )
        }catch(error){
            res.status(400).json({message: error.message})
        }
    }
};

exports.login = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
        try {    
            if(user === null){
                res.status(401).json( {message: "Paire identifiant/mot de passe incorrecte"} );
            } else {
                const valid = await bcrypt.compare(req.body.password, user.password)
                    try {
                        if(!valid) {
                            res.status(401).json( {message: "Paire identifiant/mot de passe incorrecte"} )
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jsonWebToken.sign(
                                        {userId: user._id},
                                        'RANDOM_TOKEN_SECRET',
                                        { expiresIn : '24h'}
                                )
                            })
                        }
                    }
                    catch(error) {
                        res.status(500).json( { error } )
                    }
            }
        }
        catch {
            res.status(500).json({error});
        }
};