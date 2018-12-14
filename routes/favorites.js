let controller = require("../controllers/favoritesController");
let auth = require("../middlewares/auth");

module.exports = router => {
  router.post("/", auth, controller.favorite_add);
  router.delete("/:id", auth, controller.favorite_delete);
  router.delete("/", auth, controller.favorite_clear);
}; 
