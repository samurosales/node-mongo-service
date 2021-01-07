const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require('cors')

const port = process.env.PORT || 8080;
const index = require("./index");

const app = express();
app.use(index);
app.use(cors())

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

app.get('/mongoGraph', (req, res, next) => {

    mongoose.connection.db.collection('patients', function(err, collection){
        collection.find({}).toArray(function(err, data){
                if(err)res.json(err)
            try{
                
                // let graphData = {}
                let data01 = Object.entries(data.reduce((obj, value)=>{
                if(!obj[value.location]){
                    obj[value.location] = 1
                }else{
                    obj[value.location] += 1
                }
                return obj
                },{})).map((value)=>{
                return { name: value[0], value: value[1]}
                })

                let data02 = Object.entries(data.reduce((obj, value)=>{
                if(!obj[value.infected_type]){
                    obj[value.infected_type] = 1
                }else{
                    obj[value.infected_type] += 1
                }
                return obj
                },{})).map((value)=>{
                return { name: value[0], value: value[1]}
                })


                
                
                let data03 = Object.entries(data.reduce((obj, value)=>{
                if(!obj[value.state]){
                    obj[value.state] = 1
                }else{
                    obj[value.state] += 1
                }
                return obj
                },{})).map((value)=>{
                return { name: value[0], value: value[1]}
                })

                res.json([data01, data02, data03])

        }catch(err){
            res.json(err)
        }
                })
        
                
    });

 

});

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

