const router = require("express").Router();
const chatController = require("../controller/chatController");

router.post("/", (req, res) => chatController.send(req, res));

router.get("/", (req, res) => chatController.list(req, res));

module.exports = router;
