const puppeteer = require("puppeteer");

class BookInfoLoader {

  constructor(numberLoadedBooksInCategory = 2) {

    this.startMainPage = "https://www.ozon.ru/context/div_book/";
    this.bookPage = "https://www.ozon.ru/context/detail/id/";
    this.bookSelector = "div.tile[data-v-13c5b513]";

    this.bookAuthor = "p.author-wrapper[data-v-837fc770] > span ";
    this.bookTitle = "a.name-link[data-v-837fc770]";
    this.bookCover = ".cover[data-v-cc97ef84] > img.img[data-v-0e6d3626]";
    this.bookRank = "div.stars[data-v-6cd1bede]  > div.fill[data-v-6cd1bede]";
    this.bookPrice = "span.price-number[data-v-4c2afb42] > span.main[data-v-4c2afb42]"; 

    this.bookMicroGallery = "div.eMicroGallery_previews  > div.eMicroGallery_previewsOne";
    this.bookFullImageOne = "div.eMicroGallery_fullView > img.eMicroGallery_fullImage";
    this.bookFullImage = "div.eMicroGallery_fullView.mActive > img.eMicroGallery_fullImage";
    this.bookMoreInfoText = "div.eItemDescription_text";

    this.overlaySubscription = "div.overlay-subscription";

    this.numberLoadedBooksInCategory = numberLoadedBooksInCategory;
    this.database = null;
  }

  async setNumberLoadBooks(number) {
    this.numberLoadedBooksInCategory = number;     
    await this.run();
  }


  async getDBContent() {
    if(!this.database) {
      this.database = await this.run();
    }
    return this.database;
  }

  async run() {

    try {
      const browser = await puppeteer.launch({
        headless: true,
        devtools: false
      });

      const listCategory = await this.loadListCategory();
      let result = [];
      
      /// in view mode: 174 sec 3 books in any category 5 - 518 sec /// in hide mode: 5 -> 79 sec 10, -> 133 sec, 20 -> 273 sec 
      console.time("Load data"); 
        result = await Promise.all(listCategory.map(async (item) => {
        return await this.loadCategory(item.path, numberLoadedBooksInCategory, browser);
      }));
      console.timeEnd("Load data");
      
      /// in view mode: 112 sec 3 books in any category /// in hide mode: 5 - 151 sec, 10 - 285
      /*
      console.time("Load data"); 
      for(let item of listCategory) {
        result.push({
          id: item.id,
          books: await this.loadCategory(item.path, numberLoadedBooksInCategory, browser)
        });
      }
      console.timeEnd("Load data");
      */
      return result;
    }
    catch (err) {
      console.error("Error in run method" + err);
    }
  }

  async loadCategory(startPage, numberOfBook, browser) {
    try {

      const page = await browser.newPage();
      await page.goto(startPage);
      await page.setViewport({ width: 1024, height: 768 });
      await page.waitForSelector(this.bookSelector);

      let arrayUnicElement = [];
      let lastCounter = 0;
      let throttle = 0;

      do {

        await this.scrollEndPage(page);

        let arrayElementHandle = await page.$$(this.bookSelector);

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
              item.element.$(this.bookAuthor),
              item.element.$(this.bookTitle),
              item.element.$(this.bookCover),
              item.element.$(this.bookRank),
              item.element.$(this.bookPrice)
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
        let bookInfoEx = await this.getAdditionBookInfo(page, item.id);
        item.covers = bookInfoEx.covers;
        item.text = bookInfoEx.text;
      }

      return arrayUnicElement;
    }
    catch (err) {
      console.error(`Error in loadCategory(startPage=${startPage}) err=${err}`);
    }
  }

  async scrollEndPage(page) {
    await page.evaluate( () => {
      let bookContainer = document.querySelector("div.item-wrapper[data-v-fc15957c]");
      let scrollHeight = bookContainer.scrollHeight;
      window.scrollTo(0, scrollHeight);
    });
  }

  async getAdditionBookInfo(page, id) {

    await page.goto(this.bookPage + id, { waitUntil: "load" }); 

    let result = {};
    result.covers = [];
    
    let overlayDiv = await page.$$(this.overlaySubscription);
    if(overlayDiv.length) {
      await page.evaluate(element => element.style.display = "none", overlayDiv[0]);
    }

    let arrayElementHandle = await page.$$(this.bookMicroGallery);

    let lastCover = "";

    if(arrayElementHandle.length == 1) {
      let fullPicture = await page.$$(this.bookFullImageOne);
      if(fullPicture.length) {
        const cover = await page.evaluate(element => element.currentSrc, fullPicture[0]);
        result.covers.push(cover);

      }
    } else {

      for(let i = 0; i < arrayElementHandle.length; i++) {
        try {
          await arrayElementHandle[i].hover();

        } catch (err) {
          console.log("error in hover "+ err);
          await page.waitFor(500);
          arrayElementHandle = await page.$$(this.bookMicroGallery);
          await arrayElementHandle[i].hover();

        }
      
        let src = "";
        let counter = 0;

        while((src === "" || src === lastCover) && counter < 50) {

          await page.waitFor(50);
          counter++;
          let fullPicture = await page.$$(this.bookFullImage);

          if(!fullPicture.length) {
            break;
          }
          src = await page.evaluate(element => element.currentSrc, fullPicture[0]);
        }

        if(src != "" && src != lastCover) {
          result.covers.push(src);
        }

        lastCover = src;
      }
    }

    let moreInfoText = await page.$$(this.bookMoreInfoText);
    if(moreInfoText.length) {
      const text = await page.evaluate(element => element.textContent, moreInfoText[0]);
      result.text = text;
    }

    return result;
  }

  async loadListCategory() {
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
InfoLoader.getDBContent();

module.exports = InfoLoader;
