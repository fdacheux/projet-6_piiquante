const User = require('../models/User');

const save = async(email, hash)=>{
    const user = new User({
        email,
        password: hash
    })
            
    return user.save()
            
}

module.exports = save;