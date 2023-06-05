const router = require("express").Router();
const videosController = require("../controllers/videosController");
const { isAuthenticated } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

router.get("/getVideosALL", videosController.getVideosAll);

router.get("/getVideos", isAuthenticated, videosController.getVideos);

router.post("/postVideo", isAuthenticated, upload.single("file"), videosController.postVideo);

router.put("/deleteVideo", isAuthenticated, videosController.deleteVideo);

module.exports = router;
