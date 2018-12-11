let controller = require("../controllers/cartController");

module.exports = router => {
  router.post("/", controller.cart_add);
  router.delete("/:id", controller.cart_add);
  router.delete("/", controller.cart_add);
};
