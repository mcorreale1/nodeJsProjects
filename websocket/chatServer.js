const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ejs = require('ejs');
const chatCommands = require('./chatCommand.js');
const fs = require('fs');
const path = require('path');

const {MongoClient} = require('mongodb');
const mongoURI = fs.readFileSync('./conf.txt', 'utf-8').toString();
console.log(mongoURI);

const mdclient = new MongoClient(mongoURI);
mdclient.connect();

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

        try{
            const db = mdclient.db("chatServer");
            const cons = db.collection("Connections");
            const date = new Date();
            const doc = {
                createdDate: date,
                username: username,
            };
            const result = cons.insertOne(doc);

            console.log(result);
        } catch (e) {

            console.log("ERROR: " + e);

        };

        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('rename', function(name) {
        var oldname = socket.username;
        socket.username = name;
        io.emit('is_online', '🔵 <i>'+ oldname + ' has changed their name to ' + socket.username +' ..</i>');
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
    dbList =  mdclient.db().admin().listDatabases();
    console.log(dbList);
    console.log('listening on *:8080');
});
