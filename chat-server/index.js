const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes')

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

mongoose.connect(process.env.Mongo_url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err.message)
});

app.use('/', routes);
app.use('/',messageRoutes);

const server = app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is listening to PORT:${process.env.PORT || 3000}` )
});

const io = require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3001",
        credentials: true,
    }
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    console.log(data)
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});

