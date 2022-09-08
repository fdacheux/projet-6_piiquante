const jsonWebToken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]; //extract token from entering request
        const decodedToken = jsonWebToken.verify(token, 'RANDOM_TOKEN_SECRET') // check token validity
        const userId = decodedToken.userId; // extract user's id from token
        req.auth = {
            userId: userId // add user id to our request in order to make it usable by routes
        };
        next();
    }
    catch(error) {
        res.status(403).json({ error });
    }
}