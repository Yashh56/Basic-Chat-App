import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  //   socket.emit('Welcome', 'Welcome to the server');
  //   socket.broadcast.emit('welcome',`${socket.id} has joined the chat`);

  socket.on("message", ({message,room}) => {
    console.log("message: ", message);
    io.to(room).emit("received-message", message);
    io.emit("received-message", message);
    // socket.broadcast.emit("received-message", msg);
  });

    socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
