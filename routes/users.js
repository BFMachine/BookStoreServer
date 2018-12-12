let controller = require("../controllers/userController");

module.exports = router => {
	router.get("/:userId", controller.user_id_get);
	router.get("/", controller.user_get);
	router.post("/", controller.user_create_post);
	router.put("/:userId", controller.user_update_put);
	router.delete("/:userId", controller.user_delete);
};
