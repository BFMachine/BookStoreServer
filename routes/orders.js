var express = require('express');
var router = express.Router();
let db = require("../models");



// GET all books from from favorite or cart
router.get('/:orderPath/:userId', async function(req, res, next) {

	switch(req.params.orderPath) {
		case "cart" :
		case "favorite":
			break;

		default: 
			return next();
	}

	if(req.userId != req.params.userId) {  /// ADD admin role check, user can watch only his orders!!!!!!!!!!!!!!! debug
		console.log(`User id: ${req.userId}, role: ${req.userRole}, request order id: ${req.params.userId}`);	
		return;
	}
	
	try {
		const books = await db.Order.findOne({
			where: {
				user_id: req.params.userId,
				status: req.params.orderPath // favorite || cart
			},
			attributes: ["id"],
			include : [{
					model: db.Book,
					attributes: ["id", "author", "title", "category", "description", "price", "rank"],
					include : [
						{
							model: db.File, 
							attributes: ["id", "name", "type"]
						}
					]
			}]
		});

		if(!books || !books.Books.length)
			throw new Error("not found books in db");

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.json(JSON.stringify(books.Books));
  }
  catch(err) {
      	console.error(err);
      	return res.status(404).send("No found books");
  }
});


// GET orders by USER!!!! id
//curl -v -i --header "Content-Type: application/json" --request GET  http://localhost:3000/users/orders/4
router.get('/:userId', async function(req, res, next) {

	if(req.userId != req.params.userId) {  /// ADD admin role check, user can watch only his orders!!!!!!!!!!!!!!! debug
		console.log(`User id: ${req.userId}, role: ${req.userRole}, request order id: ${req.params.userId}`);	
		return;
	}
	
	try {
		const user = await db.User.findByPk(req.params.userId, {
			include: [
				{ model: db.Order }
			],
			attributes: ["email", "full_name", "phone", "role", "address", "id"],
		});

		if(!user || !user.Orders.length)
			throw new Error("not found order id in db");

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.json(JSON.stringify(user));
  }
  catch(err) {
      	console.error(err);
      	return res.status(404).send("No found order");
  }
});

// create new order
//curl -v --header "Content-Type: application/json" --request POST --data '{"total_cost":"33.33","status":"payed"}' http://localhost:3000/users/orders
router.post('/', function(req, res, next) {

	let {total_cost, status, pay_date} = req.body;
	
	db.Order.create({
        total_cost,
        status,
        pay_date
	}).
	then(newOrder => {
		console.log(`New order ${newOrder.title}, with id ${newOrder.id} has been created.`);
        return res.sendStatus(201);
	})
	.catch((err) => {
		console.error(err);
		return res.status(500).send("Error on create new order");
	});
});

// change order data only fields send in body
//curl -v --header "Content-Type: application/json" --request PUT --data '{"total_cost":"33.33","status":"payed"}' http://localhost:3000/users/orders/3
router.put('/:orderId', function(req, res, next) {

	let update = req.body;

	db.Order.findByPk(req.params.orderId)
	.then(order => {

		if(!order) {
			console.log(`order ${req.params.orderId} not found`);
			return res.status(404).send(`order ${req.params.orderId} not found`);
		}

		console.log(`change order with id ${order.id}`);
	
		order.updateAttributes(update)
		.catch(err=>console.log(`Error on update order in db ${err}`));

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.sendStatus(200);
	})
	.catch((err) => {
		console.error(err);
		return res.status(500).send("Error on update order");
	});
});

// delete order from db
//curl -v -i --header "Content-Type: application/json" --request DELETE http://localhost:3000/users/orders/2
router.delete('/:orderId', function(req, res, next) {

	db.Order.destroy({
		where: {
		  id: req.params.orderId
		}
	})
	.then((order) => {
		if(!order) {
			console.log(`order ${req.params.orderId} not found`);
			return res.status(404).send(`order ${req.params.orderId} not found`);
		}

		console.log(`order ${req.params.orderId} successfuly deleted`);
		return res.sendStatus(204);
	})
	.catch((err) => {
		console.error(err);
		return res.status(500).send("Error delete order");
	});
});

module.exports = router;