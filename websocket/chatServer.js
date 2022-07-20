const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ejs = require('ejs');
const chatCommands = require('./chatCommand.js');
const fs = require('fs');
const path = require('path');

var myCss= {
    style : fs.readFileSync('./views/style.css', 'utf-8')
};


app.get('/', function(req, res) {
    res.render('index.ejs', {
        myCss: myCss
    });
});
app.use(express.static(path.join(__dirname, 'views')));

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;

        console.log(socket.username + "  " + socket.id);

        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        let checkMsg = chatCommands.checkMessage(message);
        if(checkMsg === null) {
            io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
        } else {
            io.to(socket.id).emit('chat_message',checkMsg)
        };
    });

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});
