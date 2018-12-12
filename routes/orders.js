let controller = require("../controllers/ordersController");

module.exports = router => {
	router.get("/:orderPath/:userId", controller.favorit_cart_get);
	router.get("/:userId", controller.orders_get);
	router.post("/", controller.orders_create_post);
	router.put("/:orderId", controller.orders_update_put);
	router.delete("/:orderId", controller.orders_delete);
};
