let jwt = require("jsonwebtoken");

function createToken(userId, email, role, longExp = false) {

    let SECRET_KEY = process.env._SECRET;
     
    let payload = { 
        exp: longExp ? (Date.now() + 1000 * 60 * 60 * 24 * 15) : (Date.now() + 1000 * 60 * 3),
        userId,
        email,
        role
    }

    token = jwt.sign(JSON.stringify(payload), SECRET_KEY); 
    return token;    
}

module.exports = createToken;