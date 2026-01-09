const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const ChatSocket = require("./socket/ChatSocket");

const app = express();
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  new ChatSocket(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
