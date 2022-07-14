const express = require('express');
const http = require('http');
const ws = require('ws');
const port = 6600;
const server = http.createServer(express);
const socket = new WebSocket.Server({server});





/*
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
        data: "Hello World!"
    }));
});
*/
server.listen(port);
