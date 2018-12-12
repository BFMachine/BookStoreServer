let controller = require("../controllers/favoritesController");

module.exports = router => {
  router.post("/", controller.favorite_add);
  router.delete("/:id", controller.favorite_delete);
  router.delete("/", controller.favorite_clear);
}; 
