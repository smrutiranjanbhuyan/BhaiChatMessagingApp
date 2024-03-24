const express = require("express");
const app = express();
const http = require("http").createServer(app);
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;

let connectedUsers = [];

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//socket
const io = require("socket.io")(http);
io.on("connection", (socket) => {
  socket.on("userName", (name) => {
    // Add user to connected users array with their name and socket ID
    connectedUsers.push({ id: socket.id, name });
    // Send updated list of connected users to all clients
    io.emit("users", connectedUsers);
  });

  console.log("connected");

  socket.on("message", (msg) => {
    // console.log(msg);
    socket.broadcast.emit("message", msg);
  });

  socket.on("disconnect", () => {
    // Remove user from connected users array
    connectedUsers = connectedUsers.filter((user) => user.id !== socket.id);
    // Send updated connected users list to client
    if (connectedUsers.length > 25) {
      connectedUsers.splice(25); 
  }
    io.emit("users", connectedUsers);
  });
});
