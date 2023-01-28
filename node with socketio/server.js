const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const socketIO = require("socket.io");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = socketIO(server);
const users = [{}];
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello world");
});
io.on("connection", (socket) => {
  socket.on("joined", (data) => {
    users[socket.id] = data.name;
    socket.emit("welcome", {
      user: "Admin",
      message: "Welcome to the chat app",
      name: users[socket.id],
    });
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: "Has Joined",
      name: users[socket.id],
    });
    socket.on("message", ({ message, id }) => {
      console.log({ message, id });
      io.broadcast.emit("sendmessage", {
        user: users[id],
        message: message,
        id: id,
      });
    });
    socket.on("disconnect", () => {
      console.log(`${users[socket.id]} Has Logout...!`);
      socket.broadcast.emit("leave", {
        user: "Admin",
        message: `${users[socket.id]} Has logout`,
      });
    });
  });
});
server.listen(PORT, () => {
  console.log("Server runinng on port http://localhost:" + PORT);
});
