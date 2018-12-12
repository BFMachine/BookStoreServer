let controller = require("../controllers/commentController");

module.exports = router => {
  router.get("/:userId", controller.comment_id_get);
  router.post("/:BookId", controller.comment_id_book);
};
