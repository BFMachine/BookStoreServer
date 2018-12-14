let db = require("../models");

// GET all books from from favorite or cart
//curl -v -i --header "Content-Type: application/json" --request GET  http://localhost:3000/orders/cart/4
exports.favorit_cart_get = async (req, res, next) => { 

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
			throw new Error(`not found ${req.params.orderPath} books in db`);

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.json(JSON.stringify(books.Books));
  }
  catch(err) {
    console.error(err);
    return res.status(404).send("No found books");
  }
};

// GET orders by USER!!!! id
//curl -v -i --header "Content-Type: application/json" --request GET  http://localhost:3000/orders/4
exports.orders_get = async (req, res) => { 

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
};

// create new order
//curl -v --header "Content-Type: application/json" --request POST --data '{"total_cost":"77.77","status":"payed"}' http://localhost:3000/orders
exports.orders_create_post = async (req, res) => { 

	let {total_cost, status, pay_date} = req.body;
	
	try {
		const newOrder = await db.Order.create({
			total_cost,
			status,
			pay_date
		});

		console.log(`New order ${newOrder.title}, with id ${newOrder.id} has been created.`);
		return res.sendStatus(201);
		
	}
	catch(err) {
		console.error(err);
		return res.status(500).send("Error on create new order");
	}
};

// change order data only fields send in body
//curl -v --header "Content-Type: application/json" --request PUT --data '{"total_cost":"33.33","status":"payed"}' http://localhost:3000/orders/3
exports.orders_update_put = async (req, res) => { 

	let update = req.body;

	try {
		const order = await db.Order.findByPk(req.params.orderId);
	
		if(!order) {
			console.log(`order ${req.params.orderId} not found`);
			return res.status(404).send(`order ${req.params.orderId} not found`);
		}

		console.log(`change order with id ${order.id}`);
		await order.updateAttributes(update);
		return res.sendStatus(200);

	}
	catch(err) {
		console.error(err);
		return res.status(500).send("Error on update order");
	}
};

// delete order from db
//curl -v -i --header "Content-Type: application/json" --request DELETE http://localhost:3000/orders/2
exports.orders_delete = async (req, res) => { 

	try {
		const order = await db.Order.destroy({
			where: {
				id: req.params.orderId
			}
		});
	
		if(!order) {
			console.log(`order ${req.params.orderId} not found`);
			return res.status(404).send(`order ${req.params.orderId} not found`);
		}

		console.log(`order ${req.params.orderId} successfuly deleted`);
		return res.sendStatus(204);
	}
	catch(err) {
		console.error(err);
		return res.status(500).send("Error delete order");
	}
};
