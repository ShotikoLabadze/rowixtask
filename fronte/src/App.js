import { useEffect, useState } from "react";
import socket from "./socket/socket";

function App() {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");

  const [publicMessages, setPublicMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);

  const [privateUser, setPrivateUser] = useState(null);

  useEffect(() => {
    socket.on("publicMessage", (data) => {
      setPublicMessages((prev) => [...prev, data]);
    });

    socket.on("privateMessage", (data) => {
      setPrivateMessages((prev) => [...prev, data]);
    });

    socket.on("system", (data) => {
      setPublicMessages((prev) => [
        ...prev,
        { user: { name: "System" }, message: data.message },
      ]);
    });

    return () => {
      socket.off("publicMessage");
      socket.off("privateMessage");
      socket.off("system");
    };
  }, []);

  const joinChat = () => {
    if (!name) return;

    socket.emit("joinPublic", { name });
    setJoined(true);
  };

  const startPrivateChat = (user) => {
    if (!user || user.name === name) return;
    setPrivateUser(user);
    setPrivateMessages([]);
  };

  const sendMessage = () => {
    if (!message) return;

    if (privateUser) {
      socket.emit("privateMessage", {
        toSocketId: privateUser.socketId,
        message,
      });
    } else {
      socket.emit("publicMessage", message);
    }

    setMessage("");
  };

  if (!joined) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Enter Name</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={joinChat}>Join</button>
      </div>
    );
  }

  const activeMessages = privateUser
    ? privateMessages
    : publicMessages;

  return (
    <div style={{ padding: 40 }}>
      <h2>
        {privateUser
          ? `Private Chat with ${privateUser.name}`
          : "Public Chat"}
      </h2>

      <div
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          marginBottom: 10,
          padding: 5,
        }}
      >
        {activeMessages.map((m, i) => (
          <div key={i}>
            <b
              style={{
                cursor: !privateUser ? "pointer" : "default",
                color: !privateUser ? "blue" : "black",
              }}
              onClick={() => !privateUser && startPrivateChat(m.user)}
            >
              {m.user?.name || "Unknown"}
            </b>
            : {m.message}
          </div>
        ))}
      </div>

      {privateUser && (
        <button onClick={() => setPrivateUser(null)}>
          ← Back to Public
        </button>
      )}

      <br /><br />

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
        style={{ width: "80%", marginRight: 5 }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
