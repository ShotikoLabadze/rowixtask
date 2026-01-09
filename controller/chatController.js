const chatService = require("../service/chatService");
const userService = require("../service/userService");

class ChatController {

  send(req, res) {
    const { userId, message } = req.body;

    if (!userService.getId(userId))
      return res.status(400).json({ message: "invalid user" });

    if (!message)
      return res.status(400).json({ message: "empty messagfe" });

    const chat = chatService.addMessage(userId, message);
    res.status(201).json(chat);
  }

  list(req, res) {
    const chats = chatService.getAll();
    res.json(chats);
  }
}

module.exports = new ChatController();
