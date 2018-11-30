var express = require('express');
var router = express.Router();
//var jwt = require('jsonwebtoken');
let db = require("../models");
let createToken = require("../modules/createToken");

// GET users listing
//curl -v --header "Content-Type: application/json" --request GET  http://localhost:3000/users/1  
router.get('/:userId', function(req, res, next) {

  	db.User.findByPk(req.params.userId, {
    	include: [
			  { model: db.Comment },
			  { model: db.Order },
    	]
  	})
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

// get all users info from db
//curl -v -i --header "Content-Type: application/json" --request GET  http://localhost:3000/users
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

// create new user and return tokens
//curl -v -i --header "Content-Type: application/json" --request POST --data '{"email":"temp@gmail.com","password":"111", "role":"user", "full_name":"Балабанов Семен Семенович", "address":"г.Таганрог", "phone":"8(8634)888-88"}' http://localhost:3000/users
router.post('/', function(req, res, next) {

	let {email, role, full_name, address, phone, password} = req.body;
	//if(user.validPassword(req.body.password)) {
	
	db.User.create({
		email,
		pass_hash: db.User.generateHash(password),
		role,
		full_name,
		address,
		phone,
		ref_token: ""
	}).
	then(newUser => {
		console.log(`New user ${newUser.email}, with id ${newUser.id} has been created.`);

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

// change user data only fields send in body, no password, email and role changed
//curl -v --header "Content-Type: application/json" --request PUT --data '{"email":"temp@gmail.com","password":"111", "role":"user", "full_name":"Балабанов Семен Семенович", "address":"г.Таганрог", "phone":"8(8634)888-88"}' http://localhost:3000/users
router.put('/:userId', function(req, res, next) {

	let update = req.body;

	if(update.password)
		delete update.password;

	if(update.email)
		delete update.email;

	if(update.role)
		delete update.role;

	db.User.findByPk(req.params.userId)
	.then(user => {

		if(!user) {
			console.log(`user ${req.params.userId} not found`);
			return res.status(404).send(`user ${req.params.userId} not found`);
		}

		console.log(`change user ${user.email}, with id ${user.id}`);
	
		user.updateAttributes(update)
		.catch(err=>console.log(`Error on update user in db ${err}`));

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.sendStatus(200);
	})
	.catch((err) => {
		console.error(err);
		return res.status(500).send("Error on update user");
	});
});

// delete user from db
//curl -v -i --header "Content-Type: application/json" --request DELETE http://localhost:3000/users/22
router.delete('/:userId', function(req, res, next) {

	db.User.destroy({
		where: {
		  id: req.params.userId
		}
	})
	.then((user) => {
		if(!user) {
			console.log(`user ${req.params.userId} not found`);
			return res.status(404).send(`user ${req.params.userId} not found`);
		}

		console.log(`user ${req.params.userId} successfuly deleted`);
		return res.sendStatus(204);
	})
	.catch((err) => {
		console.error(err);
		return res.status(500).send("Error delete user");
	});
});

module.exports = router;
