class ChatService {
  constructor() {
    this.messages = []; 
  }

  addMessage(userId, message) {
    const chat = {
      id: Date.now().toString(),
      userId,
      message,
      time: new Date()
    };
    this.messages.push(chat);
    return chat;
  }


  getAll() {
    return this.messages;
  }
}

module.exports = new ChatService();
