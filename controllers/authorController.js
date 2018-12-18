let db = require("../models");

// get all authtor  from db
exports.author_all_get = async (req, res) => {

	try {
		const filter = {
			order: [
				[ "author", "ASC" ],
			],
			plain: false
		};
		const authors = await db.Book.aggregate("author", "DISTINCT", filter);
		
		if (!authors) {
			throw new Error("not found any authors");
		}

		res.setHeader("Content-Type", "application/json; charset=utf-8");
		return res.json( authors );

	}
	catch (err) {
		console.error(err);
		return res.status(500).send("Error in author list");

	}
};
