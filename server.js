const express = require('express'); // express
const app = express();
const PORT = 4002;
const path = require('path')
const server = require('http').createServer(app);

const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", function(socket) {
    socket.on("newuser", function(username) {
        socket.broadcast.emit("update", username + " Joined Conversation");
    });
    socket.on("exituser", function(username) {
        socket.broadcast.emit("update", username + " Left Conversation");
    });
    socket.on("chat", function(message) {
        socket.broadcast.emit("chat", message);
        console.log(message)
    });
    socket.timeout(5000).emit("my-event", (err) => {
        if (err) {
            socket.broadcast.emit("Sorry TimeOut");
    }
})
    
})

server.listen(PORT);
console.log("sever started "+ PORT)