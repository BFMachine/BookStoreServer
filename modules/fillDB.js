const axios = require("axios");
const fs = require('fs'); 

const db = require("../models");
const webScraper = require("./scrape");


class FillDB {
  constructor() {
    this._destination = process.cwd() + "/public/images/";
  }

  async fill({number, visible}) {
    
    if(number) {
      webScraper.setNumberLoadBooks(number);
    }
    if(visible) {
      webScraper.setVisible(visible);
    }

    const contentDB = await webScraper.getDBContent();

    for(let i = 0; i < contentDB.length; i++) {
      for(let j = 0; j < contentDB[i].length; j++) {
        let { title, author, covers = [], id, text, price, rank, coverSmall } = contentDB[i][j];
        
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
          await db.Book.destroy({
            where: {
              id: bookData.id
            }
          });
      
          const book = await db.Book.create(bookData);

          covers.unshift(coverSmall);

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
/**
 * 
 * @param {*} path 
 * @param {*} type 
 * @param {*} book_id 
 */
  async _getAndStoreFile(path, type, book_id) {
    const filename = "file-" + Date.now() + path.match(/\.[^/.]+$/);
    console.log("load " + filename);

    return new Promise( (resolve, reject) => {

      const fileStream = fs.createWriteStream(this._destination + filename);
        //console.log("1 - axios");
        axios.request({
          responseType: "stream",
          url: path,
          method: "get",
          headers: {
            "Content-Type": "image/*",
          }
        })
        .then(response => {
          //console.log("2 - response axios");
          response.data.pipe(fileStream);
          //console.log("3 - file created");
          db.File.create({
            type,
            name: "images/" + filename,
            book_id
          })
          .then(file => {
            if(file) {
              console.log(`File added ${this._destination + filename},
with id ${file.id} for book id ${book_id} has been created.`);
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
          fs.unlink(this._destination + filename, err => {
            if (err) throw err;
            console.error(this._destination + filename + " was deleted");
          });
          resolve(false);
        });
     });
  }
}

const fillDB = new FillDB();
//instanse.fill();

module.exports = fillDB;
