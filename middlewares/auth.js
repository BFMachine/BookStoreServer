var jwt = require('jsonwebtoken');

// test with refresh token
// curl -v --header "authorization:Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NDQ4ODQ1MjI3MzIsImlkIjo0LCJyb2xlIjoidXNlciIsImVtYWlsIjoidGVtcEBnbWFpbC5jb20ifQ.Q7_KlBWCjNiLvb10E1KWuvEWmgLPqTQpR3OvL5oWzDg" --request GET  http://localhost:3000/books/1
function auth(req, res, next) {

 /// TEMP
    return next();

    if(req.path == "/books" && req.method == "GET") {
        return next();
    }

    if((req.path == "/users" || req.path == "/api/auth") && req.method == "POST") {
        return next();
    }
        
    const header = req.headers["authorization"];
    let token;

    if(header) {
        const bearer = header.split(' ');
        token = bearer[1];
    } else {
        console.log("no any token in request");
        return res.sendStatus(403);
    }

    jwt.verify(token, process.env._SECRET, (err, authorizedData) => {
        if(err){
            console.log("not valid token in auth");
            return res.sendStatus(403);
        } else {
            //If token is successfully verified, we can send the autorized data 
            console.log('SUCCESS: Connected to protected route');
            console.log(authorizedData);
            req.userId = authorizedData.id;
            req.userRole = authorizedData.role;
            req.userEmail = authorizedData.email;
            return next();
        }
    });
}

module.exports = auth;