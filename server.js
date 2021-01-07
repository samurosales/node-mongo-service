const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 8080;
const index = require("./index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});
const mongoose = require('mongoose')
mongoose.connect('mongodb://34.123.45.62:27017/db-covid',{"auth":{"authSource" : "admin"}, "user" : "mongoadmin", "pass" : "sopes1"},
    function(err, db){
        if(err){
            throw err
        }
        console.log('Database connected')
})

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 5000);
  secondInterval = setInterval(() => getApiAndEmit(socket), 5000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client

  mongoose.connection.db.collection('patients', function(err, collection){
                    collection.find({}).toArray(function(err, data){
                          let jsonData = JSON.stringify(data)
                          socket.emit('patientsMessage', jsonData)
                          socket.emit('patientsGraph', jsonData)
                    })
                });

  // socket.emit("connection", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));

