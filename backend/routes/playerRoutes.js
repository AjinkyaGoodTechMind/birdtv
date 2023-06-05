const router = require("express").Router();
const playerController = require("../controllers/playerController");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/getPlayerById", playerController.getPlayerById);

router.get("/getPlayers", isAuthenticated, playerController.getPlayer);

router.post("/postPlayer", isAuthenticated, playerController.postPlayer);

router.put("/deletePlayer", isAuthenticated, playerController.deletePlayer);

router.put("/updatePlayer", isAuthenticated, playerController.updatePlayer);

module.exports = router;
