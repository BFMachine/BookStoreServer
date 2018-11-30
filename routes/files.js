var express = require('express');
var router = express.Router();
let db = require("../models");
var multer = require("multer");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
      fileExtension = file.originalname.split('.')[1] 
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension)
    }
});

var upload = multer({storage: storage});

// upload file on server POST
router.post('/', upload.single('file'), function(req, res, next) {
    
    console.log("book id =" + req.body.book_id)

    db.File.create({
        type: "cover",
        name: "public/images/" + req.file.filename,
        book_id: req.body.book_id
	}).
	then(file => {
		console.log(`File uploaded successfuly ${"public/images/" + req.file.filename}, with id ${file.id} has been created.`);
        return res.sendStatus(201);
	})
	.catch((err) => {
		console.error(err.message);
		return res.status(500).send(`Error on upload file: ${err.message}`);
	});
});

module.exports = router;