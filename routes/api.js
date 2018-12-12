let controller = require("../controllers/authController");

module.exports = router => {
  router.post("/auth", controller.auth);
  router.get("/refresh", controller.refresh);
};
