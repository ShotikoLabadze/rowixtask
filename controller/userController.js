const userService = require("../service/userService");

class UserController {
  create(req, res) {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "no namee" });

    const user = userService.create(name);
    res.status(201).json(user);
  }

  list(req, res) {
    res.json(userService.getAll());
  }
}

module.exports = new UserController();
