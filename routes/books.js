var express = require('express');
var router = express.Router();
let db = require("../models");


// get all books  from db
//curl -v --header "Content-Type: application/json" --request GET  http://localhost:3000/books  
router.get('/', function(req, res, next) {

	db.Book.findAll()
	.then(books => {
		
		if(!books)
			throw new Error("not found any books");

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.json(JSON.stringify(books));
	})
	.catch((err) => {
		console.error(err);
		return res.status(500).send("Error in book list");
	});
});


// delete book from db
//curl -v -i --header "Content-Type: application/json" --request DELETE http://localhost:3000/books/2
router.delete('/:bookId', function(req, res, next) {

	db.Book.destroy({
		where: {
		  id: req.params.bookId
		}
	})
	.then((book) => {
		if(!book) {
			console.log(`book ${req.params.bookId} not found`);
			return res.status(404).send(`book ${req.params.bookId} not found`);
		}

		console.log(`book ${req.params.bookId} successfuly deleted`);
		return res.sendStatus(204);
	})
	.catch((err) => {
		console.error(err);
		return res.status(500).send("Error delete book");
	});
});

module.exports = router;