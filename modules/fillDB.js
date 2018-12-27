const axios = require("axios");
const fs = require('fs'); 

const db = require("../models");
const InfoLoader = require("../scrape/scrape");


class FillDB {
  constructor() {
    this._destination = process.cwd() + "/public/images";
  }

  async run() {
    
    const contentDB = await InfoLoader.getDBContent();

    for(let i = 0; i < contentDB.length; i++) {
      for(let j = 0; j < contentDB[i].length; j++) {
        let { title, author, covers, id, text, price, rank } = contentDB[i][j];
        
        /// refactor front if need 
        const fixRank = ["one", "two", "three", "four", "five"];
        if(rank == 100) {
          rank = 99;
        }
        const convertedRank = fixRank[Math.floor((rank)/20)];

        const bookData = {
          id,
          title,
          author,
          description: text,
          price,
          rank: convertedRank,
          category: i + 1
        };

        try {
          let book = await db.Book.findByPk(id);
      
          if (!book) {
            book = await db.Book.create(bookData);
          } else {
            await book.updateAttributes(bookData)
              .catch(err => console.error(`Error on update book in db ${err}`));
          }
          
          for(let k = 0; k < covers.length; k++) {
            let ret;
            let countTry = -1;

            do {
              if(++countTry) {
                console.error(`error load ${covers[k]} - try # ${countTry}`);
                if(countTry > 4) {
                  break;
                }
              }
              ret = await this._getAndStoreFile(covers[k], "cover", book.id);  
            } while(!ret);
          }
        }
        catch (err) {
          console.error(err);
        }
      }

    }

    console.log("work complete");

  }

  async _getAndStoreFile(path, type, book_id) {
    const filename = "file-" + Date.now() + path.match(/\.[^/.]+$/);

    return new Promise( (resolve, reject) => {

        const fileStream = fs.createWriteStream("public/images/" + filename);

        axios.request({
          responseType: "stream",
          url: path,
          method: "get",
          headers: {
            "Content-Type": "image/*",
          }
        })
        .then(response => {
          response.data.pipe(fileStream);
          
          db.File.create({
            type,
            name: "images/" + filename,
            book_id
          })
          .then(file => {
            if(file) {
              console.log(`File added successfuly ${"public/images/" + filename}, with id ${file.id} has been created.`);
              resolve(true);
            }
          })
          .catch(err => {
            console.error("error load image " + err);
            reject(err);
          });
        })
        .catch(err => {
          console.error("error load image " + err);
          //fs.end();
          fs.unlink("public/images/" + filename, err => {
            if (err) throw err;
            console.error("public/images/" + filename + " was deleted");
          });
          resolve(false);
        });
     });
  }
}

const instanse = new FillDB();
instanse.run();
