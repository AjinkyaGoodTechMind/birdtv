const router = require("express").Router();
const conentUnitController = require("../controllers/conentUnitController");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/getConentUnitById", conentUnitController.getConentUnitById);

router.get("/getConentUnits", isAuthenticated, conentUnitController.getConentUnit);

router.post("/postConentUnit", isAuthenticated, conentUnitController.postConentUnit);

router.put("/deleteConentUnit", isAuthenticated, conentUnitController.deleteConentUnit);

router.put("/updateConentUnit", isAuthenticated, conentUnitController.updateConentUnit);

module.exports = router;
