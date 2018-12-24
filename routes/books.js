let controller = require("../controllers/bookController");
let auth = require("../middlewares/auth");

module.exports = router => {
	router.get("/search", controller.book_search);
	router.get("/:bookId", controller.book_id_get);
	router.get("/", controller.book_all_get);
	router.post("/", auth, controller.book_create_post);
	router.put("/:bookId", auth, controller.book_update_put);
	router.delete("/:bookId", auth, controller.book_delete);
};
