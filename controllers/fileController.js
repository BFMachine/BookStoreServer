let multer = require("multer");
let db = require("../models");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
      let fileExtension = file.originalname.split('.')[1];
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
    }
});

let upload = multer({storage});

exports.multer_mw = upload.single('file');

exports.file_upload = async (req, res) => {
    
  console.log("book id =" + req.body.book_id);

  try {
    const file = await db.File.create({
      type: "cover",
      name: "images/" + req.file.filename,
      book_id: req.body.book_id
    });

    if(file) {
      console.log(`File uploaded successfuly ${"public/images/" + req.file.filename}, with id ${file.id} has been created.`);
      return res.sendStatus(201);
    }
  }
	catch(err) {
		console.error(err.message);
		return res.status(500).send(`Error on upload file: ${err.message}`);
	}
};
