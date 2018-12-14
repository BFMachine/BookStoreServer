let controller = require("../controllers/userController");
let auth = require("../middlewares/auth");

module.exports = router => {
	router.get("/:userId", auth, controller.user_id_get);
	router.get("/", controller.user_get);
	router.post("/", controller.user_create_post);
	router.put("/:userId", auth, controller.user_update_put);
	router.delete("/:userId", auth, controller.user_delete);
};
