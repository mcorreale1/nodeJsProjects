const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const port = 6600;
const server = http.createServer(express);
const socket = new WebSocket.Server({server});

socket.on('connnection', function connection(ws) {
    console.log('New connection');
    ws.on('message', function incoming(data) {
        socket.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        })
    })
})

/*
server.listen(port, function() {
    console.log('Server is listening on port ${port}!')
})
*/

/*
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        data: "Hello World!"
    }));
});
*/
server.listen(port);
