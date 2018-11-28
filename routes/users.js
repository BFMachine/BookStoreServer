var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
let db = require("../models");
let createToken = require("../modules/createToken");

/* GET users listing. */
router.get('/:userId', function(req, res, next) {

  db.User.findById(req.params.userId)
  .then(user => {
    
    if(!user)
        throw new Error("not found user id in db");

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.json(JSON.stringify(user));
  })
  .catch((err) => {
    console.error(err);
    return res.status(404).send("No found user id");
  });
});


router.get('/', function(req, res, next) {

  db.User.findAll({
    attributes: ["email", "role", "full_name", "address", "phone"]
  })
  .then(users => {
    
    if(!users)
        throw new Error("not found any users");

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.json(JSON.stringify(users));
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).send("Error in user list");
  });
});


router.post('/', function(req, res, next) {
  //curl -v -i --header "Content-Type: application/json" --request POST --data '{"email":"temp@gmail.com","password":"111", "role":"user", "full_name":"Балабанов Семен Семенович", "address":"г.Таганрог", "phone":"8(8634)888-88"}' http://localhost:3000/users

  let {email, role, full_name, address, phone, password} = req.body;
  //if(user.validPassword(req.body.password)) {
  
  db.User.create({
    email,
    pass_hash: db.User.generateHash(password),
    role,
    full_name,
    address,
    phone,
    ref_token: "",
    createdAt: new Date()
  }).
  then(newUser => {
    console.log(`New user ${newUser.name}, with id ${newUser.id} has been created.`);

    let newAccessToken = createToken(newUser.id, newUser.email, newUser.role);
    let newRefreshToken = createToken(newUser.id, newUser.email, newUser.role, true);
  
    newUser.updateAttributes({
        ref_token: newRefreshToken
    })
    .catch(err=>console.log(`Error on update refresh token in base ${err}`));
    
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(201).json(JSON.stringify({  
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    }));
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).send("Error on create new user");
  });
});

module.exports = router;
