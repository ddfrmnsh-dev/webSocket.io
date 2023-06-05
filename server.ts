import express from 'express';
import http from 'http';
import path from 'path';
import {Server} from 'socket.io'
// import formatMessage from './utils/message'
const formatMessage = require('./utils/msg.js')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/user.js')
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const botName = 'ChatCord Bot'
app.use(express.static(path.join(__dirname, 'public')));

// Run when clients connect
io.on('connection', socket => {
    console.log('New WS Connection...')
    socket.on('joinRoom', ({ username, room}) => {
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)

    // Welcome the current user
    socket.emit('message', formatMessage(botName,'Welcome to ChatCord'));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

    })
    // Send users and room info
    // Runs when clients disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user) {
            io.to(user.room).emit('message', formatMessage(botName,`${user.username}has left the chat`))
        }
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username ,msg)) 
    })
})
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () =>
    console.log(`Server running on port  http://localhost:${PORT}`)
)
