const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token }); //Find a user that matches the ID and has a token in the tokens array that matches
    
        if(!user) {
            throw new Error();
        }

        req.token = token;  //Puts the token on the req object so we don't have to do the work again
        req.user = user;
        next();
    }catch(e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
}

module.exports = auth;