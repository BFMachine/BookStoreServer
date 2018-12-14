let controller = require("../controllers/fileController");
let auth = require("../middlewares/auth");

module.exports = router => {
    router.post("/", auth, controller.multer_mw, controller.file_upload);
};
