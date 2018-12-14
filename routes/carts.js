let controller = require("../controllers/cartController");
let auth = require("../middlewares/auth");

module.exports = router => {
  router.post("/", auth, controller.cart_add);
  router.delete("/:id", auth, controller.cart_delete);
  router.delete("/", auth, controller.cart_clear);
}; 
