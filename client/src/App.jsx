import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  // console.log(messages);

  const socket = useMemo(() => io("http://localhost:3000"), []);
  // const socket = io("http://localhost:3000");
  socket.on("connect", () => {
    console.log("connected");
  });

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("received-message", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("welcome", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  return (
    <div id="home">
      <h1>Id: {socketID}</h1>

      <form className="flex">
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          type="text"
          placeholder="Join room"
        />
        <button onClick={handleJoinRoom} type="submit">
          Join
        </button>
      </form>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
        />
        <input
          placeholder="Enter room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          type="text"
        />
        <input type="submit" value="Send" />
        {/* <button onClick={handleSubmit} type="submit">Send</button> */}
      </form>

      <div className="messages">
        {messages.map((msg, i) => (
          <p className="flex float-right" key={i}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
