const router = require("express").Router();
const userController = require("../controller/userController");

router.post("/", (req, res) => userController.create(req, res));
router.get("/", (req, res) => userController.list(req, res));

module.exports = router;
