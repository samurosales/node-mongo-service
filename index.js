// const socket = io('https://20201228t234608-dot-server-dot-sopes1-dic2020.nn.r.appspot.com:8080')

// socket.on('message', (data)=>{
//     console.log(data)
// })

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

module.exports = router;