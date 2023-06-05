const router = require("express").Router();
const sessionController = require("../controllers/sessionController");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/getSession", isAuthenticated, sessionController.getSession);

router.post("/register", sessionController.register);

router.post("/login", sessionController.login);

router.post("/addDomain", isAuthenticated, sessionController.addDomain);

router.get("/logout", sessionController.logout);

module.exports = router;
