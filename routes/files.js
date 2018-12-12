let controller = require("../controllers/fileController");

module.exports = router => {
    router.post("/", controller.multer_mw, controller.file_upload);
};
