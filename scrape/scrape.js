const puppeteer = require("puppeteer");
const fs = require("fs");

class BookInfoLoader {

  constructor(numberLoadedBooksInCategory = 5) {

    this._startMainPage = "https://www.ozon.ru/context/div_book/";
    this._bookPage = "https://www.ozon.ru/context/detail/id/";
    this._bookSelector = "div.tile[data-v-13c5b513]";

    this._bookAuthor = "p.author-wrapper[data-v-837fc770] > span ";
    this._bookTitle = "a.name-link[data-v-837fc770]";
    this._bookCover = ".cover[data-v-cc97ef84] > img.img[data-v-0e6d3626]";
    this._bookRank = "div.stars[data-v-6cd1bede]  > div.fill[data-v-6cd1bede]";
    this._bookPrice = "span.price-number[data-v-4c2afb42] > span.main[data-v-4c2afb42]"; 

    this._bookMicroGallery = "div.eMicroGallery_previews  > div.eMicroGallery_previewsOne";
    this._bookFullImageOne = "div.eMicroGallery_fullView > img.eMicroGallery_fullImage";
    this._bookFullImage = "div.eMicroGallery_fullView.mActive > img.eMicroGallery_fullImage";
    this._bookMoreInfoText = "div.eItemDescription_text";

    this._overlaySubscription = "div.overlay-subscription";

    this._numberLoadedBooksInCategory = numberLoadedBooksInCategory;
    this._database = null;
    this._fileName = "loaded_db.json";
  }

  async setNumberLoadBooks(number) {
    this._numberLoadedBooksInCategory = number;     
    this._database = await this._run();  
    this._writeFile(this._database);
  }

  async _readFile() {

    return new Promise( (resolve, reject) => {
      fs.readFile(this._fileName, "utf8", (error, data) => {
        if(error) {
          return reject(error); 
        }
        resolve(JSON.parse(data));
      });
    });
  }

  async _writeFile(data) {

    return new Promise( (resolve, reject) => {
      const dbString = JSON.stringify(data, [
        "title",
        "author",
        "covers",
        "id",
        "price",
        "rank",
        "text",
        "coverSmall"
      ]);

      fs.writeFile(this._fileName, dbString, "utf8", (error) => {
        if(error) {
          return reject(error); 
        }
        resolve(true);
      });
    });
  }

  async getDBContent(forseLoad = false) {

    if(!this._database) {
      let db;
      try {
        db = await this._readFile();
      }
      catch(err) {
        console.log("error load file " + err);
      }

      if(forseLoad || !db) {
        this._database = await this._run();  
        this._writeFile(this._database);
      } else {
         this._database = db;
      }
    }

    return this._database;
  }

  async _run() {

    try {
      const browser = await puppeteer.launch({
        headless: true,
        devtools: false
      });

      const listCategory = await this._loadListCategory();
      let result = [];
      
      /// in view mode: 174 sec 3 books in any category 5 - 518 sec /// in hide mode: 5 -> 79 sec 10, -> 133 sec, 20 -> 273 sec 
      console.time("Load data"); 
        result = await Promise.all(listCategory.map(async (item) => {
        return await this.loadCategory(item.path, this._numberLoadedBooksInCategory, browser);
      }));
      console.timeEnd("Load data");
      
      /// in view mode: 112 sec 3 books in any category /// in hide mode: 5 - 151 sec, 10 - 285
      /*
      console.time("Load data"); 
      for(let item of listCategory) {
        result.push({
          id: item.id,
          books: await this.loadCategory(item.path, _numberLoadedBooksInCategory, browser)
        });
      }
      console.timeEnd("Load data");
      */
      return result;
    }
    catch (err) {
      console.error("Error in _run method" + err);
    }
  }

  async loadCategory(startPage, numberOfBook, browser) {
    try {

      const page = await browser.newPage();
      await page.goto(startPage);
      await page.setViewport({ width: 1024, height: 768 });
      await page.waitForSelector(this._bookSelector);

      let arrayUnicElement = [];
      let lastCounter = 0;
      let throttle = 0;

      do {

        await this._scrollEndPage(page);

        let arrayElementHandle = await page.$$(this._bookSelector);

        let arrayLoadedId = await Promise.all(
          arrayElementHandle.map(async element => {
            return {
              id: await page.evaluate(item => item.id, element),
              element
            };
          })
        );

        arrayLoadedId.forEach( item => {
          if(!arrayUnicElement.find(loadedItem => loadedItem.id === item.id)) {
            arrayUnicElement.push(item);
          }
        }); 

        await Promise.all(arrayUnicElement.map(async (item) => {

          if(!item.title) {
            let requestElements = [
              item.element.$(this._bookAuthor),
              item.element.$(this._bookTitle),
              item.element.$(this._bookCover),
              item.element.$(this._bookRank),
              item.element.$(this._bookPrice)
            ];
      
            let elements = await Promise.all(requestElements);
      
            let requestData = [
              page.evaluate(element => element.textContent, elements[0]),
              page.evaluate(element => element.textContent, elements[1]),
              page.evaluate(element => element.currentSrc, elements[2]),
              page.evaluate(element => element && element.style.width, elements[3]),
              page.evaluate(element => element.innerHTML, elements[4]),
            ];
      
            let data = await Promise.all(requestData);
            
            item.author = data[0].trim();
            item.title = data[1].trim();
            item.coverSmall = data[2].trim();
            item.rank = data[3] ? parseInt(data[3]) : 0;
            item.price = parseInt(data[4].replace(/&nbsp;/g, ''));
          }
        }));

        if(lastCounter < arrayUnicElement.length) {
            lastCounter = arrayUnicElement.length;
        } else {
          if(throttle++ > 1000) {
            break;
          }
        }

      } while (arrayUnicElement.length  < numberOfBook);

      console.log(`Path=${startPage} loaded=${arrayUnicElement.length}`);
      
      arrayUnicElement = arrayUnicElement.slice(0, numberOfBook);

      for(let item of arrayUnicElement) {
        let bookInfoEx = await this._getAdditionBookInfo(page, item.id);
        item.covers = bookInfoEx.covers;
        item.text = bookInfoEx.text;
      }

      return arrayUnicElement;
    }
    catch (err) {
      console.error(`Error in loadCategory(startPage=${startPage}) err=${err}`);
    }
  }

  async _scrollEndPage(page) {

    await page.evaluate( () => {
      let bookContainer = document.querySelector("div.item-wrapper[data-v-fc15957c]");
      let scrollHeight = bookContainer.scrollHeight;
      window.scrollTo(0, scrollHeight);
    });
  }

  async _getAdditionBookInfo(page, id) {

    await page.goto(this._bookPage + id, { waitUntil: "load", timeout: 90000 }); 

    let result = {};
    result.covers = [];
    
    let overlayDiv = await page.$$(this._overlaySubscription);
    if(overlayDiv.length) {
      await page.evaluate(element => element.style.display = "none", overlayDiv[0]);
    }

    let arrayElementHandle = await page.$$(this._bookMicroGallery);

    let lastCover = "";

    if(arrayElementHandle.length == 1) {
      let fullPicture = await page.$$(this._bookFullImageOne);
      if(fullPicture.length) {
        const cover = await page.evaluate(element => element.currentSrc, fullPicture[0]);
        result.covers.push(cover);
        console.log(`load cover : ${cover}`);
      }
    } else {

      for(let i = 0; i < arrayElementHandle.length; i++) {
        try {
          await arrayElementHandle[i].hover();

        } catch (err) {
          console.log("exeption in hover method : " + err);
          await page.waitFor(500);
          arrayElementHandle = await page.$$(this._bookMicroGallery);
          await arrayElementHandle[i].hover();

        }
      
        let src = "";
        let counter = 0;

        while((src === "" || src === lastCover) && counter < 50) {

          await page.waitFor(50);
          counter++;
          let fullPicture = await page.$$(this._bookFullImage);

          if(!fullPicture.length) {
            break;
          }
          src = await page.evaluate(element => element.currentSrc, fullPicture[0]);
        }

        if(src != "" && src != lastCover) {
          result.covers.push(src);
          console.log(`load cover : ${src}`);
        }

        lastCover = src;
      }
    }

    let moreInfoText = await page.$$(this._bookMoreInfoText);
    if(moreInfoText.length) {
      const text = await page.evaluate(element => element.textContent, moreInfoText[0]);
      result.text = text;
    }

    return result;
  }

  async _loadListCategory() {
    const list = [
      {
        id: 1,
        path: "https://www.ozon.ru/category/40006/"
      },
      {
        id: 2,
        path: "https://www.ozon.ru/category/40002/"
      },
      {
        id: 3,
        path: "https://www.ozon.ru/category/40014/"
      },
      {
        id: 4,
        path: "https://www.ozon.ru/category/40003/"
      },
      {
        id: 5,
        path: "https://www.ozon.ru/category/40005/"
      },
      {
        id: 6,
        path: "https://www.ozon.ru/category/40020/"
      },
      {
        id: 7,
        path: "https://www.ozon.ru/category/40025/"
      },
    ];

    return list;
  }
}

const InfoLoader = new BookInfoLoader();
//InfoLoader.setNumberLoadBooks(20);
//InfoLoader.getDBContent();

module.exports = InfoLoader;