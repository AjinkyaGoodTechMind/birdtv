const router = require("express").Router();
const playlistController = require("../controllers/playlistController");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/getPlaylistById", playlistController.getPlaylistById);

router.get("/getPlaylists", isAuthenticated, playlistController.getPlaylists);

router.post("/postPlaylist", isAuthenticated, playlistController.postPlaylist);

router.put("/deletePlaylist", isAuthenticated, playlistController.deletePlaylist);

router.put("/updatePlaylist", isAuthenticated, playlistController.updatePlaylist);

module.exports = router;
