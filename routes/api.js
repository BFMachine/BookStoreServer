let controller = require("../controllers/authController");
let auth = require("../middlewares/auth");

module.exports = router => {
  router.post("/auth", controller.auth);
  router.get("/refresh", auth, controller.refresh);
};
