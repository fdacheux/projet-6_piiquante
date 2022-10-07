const bcrypt = require('bcrypt');

const hashPassword = async (password) => bcrypt.hash(password, 10);
const compareHashedPasswords = async (reqPassword, userPassword) => bcrypt.compare(reqPassword, userPassword, (error) => {
    if (error) {
        throw new Error({message : error}); 
    }
});



module.exports = {hashPassword, compareHashedPasswords};