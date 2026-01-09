class ChatSocket {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;

    socket.on("joinPublic", (user) => this.joinPublic(user));
    socket.on("publicMessage", (msg) => this.publicMessage(msg));
    socket.on("privateMessage", (data) => this.privateMessage(data));

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  }

  joinPublic = (user) => {
    this.socket.user = {
      ...user,
      socketId: this.socket.id,
    };

    this.socket.join("public");

    this.io.to("public").emit("system", {
      message: `${user.name} joined public chat`,
    });
  };

  publicMessage = (message) => {
    this.io.to("public").emit("publicMessage", {
      user: this.socket.user,
      message,
      time: new Date(),
    });
  };

  privateMessage = ({ toSocketId, message }) => {
    if (!this.socket.user) return;

    const room = this.privateRoom(this.socket.id, toSocketId);

    this.socket.join(room);
    this.io.sockets.sockets.get(toSocketId)?.join(room);

    const payload = {
      user: this.socket.user,
      message,
      time: new Date(),
    };

    this.io.to(room).emit("privateMessage", payload);
  };

  privateRoom = (a, b) => {
    return [a, b].sort().join("_");
  };
}

module.exports = ChatSocket;
