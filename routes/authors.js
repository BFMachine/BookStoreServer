let controller = require("../controllers/authorController");

module.exports = router => {
	router.get("/", controller.author_all_get);
};
