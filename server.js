const express = require("express");
const { join } = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
require('dotenv').config();

server.listen(process.env.SERVER_APP_PORT);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
});

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
});

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log('user joined: ', userId, roomId);
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected', userId)
    })
});

console.log(`Server running on http://localhost:${process.env.SERVER_APP_PORT}`);