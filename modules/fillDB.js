let db = require("../models");
let InfoLoader = require("../scrape/scrape");

class FillDB {
  constructor() {
  }

  async run() {
    
    const contentDB = await InfoLoader.getDBContent();
    




    /*
    let { title, author, description, price, rank, category } = req.body;

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
      return res.status(201).json({ book_id: newBook.id });
    }
    catch (err) {
      console.error(err);
      return res.status(500).send("Error on create new book");
    }
    */


  }
}

const instanse = new FillDB();
instanse.run();
