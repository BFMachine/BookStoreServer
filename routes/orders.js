let controller = require("../controllers/ordersController");
let auth = require("../middlewares/auth");

module.exports = router => {
	router.get("/:orderPath/:userId", auth, controller.favorit_cart_get);
	router.get("/:userId", auth, controller.orders_get);
	router.post("/", auth, controller.orders_create_post);
	router.put("/:orderId", auth, controller.orders_update_put);
	router.delete("/:orderId", auth, controller.orders_delete);
};
