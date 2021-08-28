const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const mongo = require("mongodb").MongoClient;

const PORT = process.env.PORT || 4000;

// Connect to mongo
mongo.connect(
  "mongodb+srv://admin:admin123@cluster0.mnx35.mongodb.net/mongochat?retryWrites=true&w=majority",
  function (err, client) {
    if (err) {
      throw err;
    }
let db = client.db('chats')
    console.log("MongoDB connected...");

    io.on("connection", (socket) => {
      let chat = db.collection("chats");

      // Create function to send status
      sendStatus = function (s) {
        socket.emit("status", s);
      };
      socket.on("message", ({ name, message }) => {
        io.emit("message", { name, message });
      });

      socket.on("room", (room) => {
        io.emit("room", room);
      });
    });

    http.listen(PORT, function () {
      console.log(`listening on port ${PORT}`);
    });
  }
);
