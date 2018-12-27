let controller = require("../controllers/authController");
let s_controller = require("../controllers/scrapeController");
let auth = require("../middlewares/auth");

module.exports = router => {
  router.post("/auth", controller.auth);
  router.get("/refresh", auth, controller.refresh);
  router.get("/scrape(/:number)?(/:visible)?", /*auth,*/ s_controller.scrape);
};
