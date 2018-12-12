let controller = require("../controllers/bookController");

module.exports = router => {
	router.get("/", controller.book_all_get);
	router.get("/:bookId", controller.book_id_get);
	router.post("/", controller.book_create_post);
	router.put("/:bookId", controller.book_update_put);
	router.delete("/:bookId", controller.book_delete);
};
