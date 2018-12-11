let db = require("../models");

// get all books  from db
//curl -v --header "Content-Type: application/json" --request GET  http://localhost:3000/books  
exports.book_all_get = async (req, res) => {

	try {

		let books = await db.Book.findAll({
			attributes: ["id", "author", "title", "category", "description", "price", "rank"],
			include : [{ 
				model: db.File, 
				attributes: ["id", "name", "type"]
			}]
		});
		
		if(!books) {
			throw new Error("not found any books");
		}

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.json(JSON.stringify(books));

	}
	catch(err) {
		console.error(err);
		return res.status(500).send("Error in book list");
		
	}
};

// get book for id from db
//curl -v --header "Content-Type: application/json" --request GET  http://localhost:3000/books/3  
exports.book_id_get = async (req, res) => {

  try {
    const book = await db.Book.findByPk(req.params.bookId, {
      include: [
        { model: db.File },
        { model: db.Comment }
      ]
    });
	
		if(!book)
			throw new Error("not found book on id");

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.json(JSON.stringify(book));
	}
	catch(err) {
		console.error(err);
		return res.status(404).send("No found book id");
	}
};

// create new book
//curl -v --header "Content-Type: application/json" --request POST --data '{"title":"Метро чегототам","author":"Дмитрий Глуховский","price":"5.95","rank":"two","category":"4","description":"Третья мировая стерла человечество с лица Земли. Планета опустела. Мегаполисы обращены в прах и пепел. Железные дороги ржавеют. Спутники одиноко болтаются на орбите. Радио молчит на всех частотах. Выжили только те, кто, услышав сирены тревоги, успел добежать до дверей московского метро. Там, на глубине в десятки метров, на станциях и в туннелях, люди пытаются переждать конец света. Там они создали себе новый мирок вместо потерянного огромного мира..."}' http://localhost:3000/books
exports.book_create_post = async (req, res) => {

	let {title, author, description, price, rank, category} = req.body;
  
  try {
    const newBook = await db.Book.create({
      title,
      author,
      description,
      price,
      rank,
      category
    });
    
    console.log(`New book ${newBook.title}, with id ${newBook.id} has been created.`);
    return res.sendStatus(201);
	}
	catch(err) {
		console.error(err);
		return res.status(500).send("Error on create new book");
	}
};

// change book data only fields send in body
//curl -v --header "Content-Type: application/json" --request PUT --data '{"title":"Метро чегототам","author":"Дмитрий Глуховский","price":"5.95","rank":"two","category":"4","description":"Третья мировая стерла человечество с лица Земли. Планета опустела. Мегаполисы обращены в прах и пепел. Железные дороги ржавеют. Спутники одиноко болтаются на орбите. Радио молчит на всех частотах. Выжили только те, кто, услышав сирены тревоги, успел добежать до дверей московского метро. Там, на глубине в десятки метров, на станциях и в туннелях, люди пытаются переждать конец света. Там они создали себе новый мирок вместо потерянного огромного мира..."}' http://localhost:3000/books/2
exports.book_update_put = async (req, res) => {

	let update = req.body;

  try {
    const book = await db.Book.findByPk(req.params.bookId);
	
		if(!book) {
			console.log(`book ${req.params.bookId} not found`);
			return res.status(404).send(`book ${req.params.bookId} not found`);
		}

		console.log(`change book ${book.title}, with id ${book.id}`);
	
		await book.updateAttributes(update)
		.catch(err=>console.log(`Error on update book in db ${err}`));

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.sendStatus(200);
	}
	catch(err) {
		console.error(err);
		return res.status(500).send("Error on update book");
	}
};

// delete book from db
//curl -v -i --header "Content-Type: application/json" --request DELETE http://localhost:3000/books/2
exports.book_delete = async (req, res) => {

  try {
    const book = await db.Book.destroy({
      where: {
        id: req.params.bookId
      }
    });
	
		if(!book) {
			console.log(`book ${req.params.bookId} not found`);
			return res.status(404).json({message:`book ${req.params.bookId} not found`});
		}

		console.log(`book ${req.params.bookId} successfuly deleted`);
		return res.sendStatus(204);
	}
	catch(err) {
		console.error(err);
		return res.status(500).send("Error delete book");
	}
};