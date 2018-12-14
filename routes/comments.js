let controller = require("../controllers/commentController");
let auth = require("../middlewares/auth");

module.exports = router => {
  router.get("/:userId", auth, controller.comment_id_get);
  router.post("/:BookId", auth, controller.comment_id_book);
};
