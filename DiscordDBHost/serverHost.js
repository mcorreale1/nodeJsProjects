const express = require('express');
const app = express();
const chatCommands = require('./chatCommand.js');
const fs = require('fs');
const path = require('path');

const {MongoClient} = require('mongodb');
const mongoURI = fs.readFileSync('./conf.txt', 'utf-8').toString();
console.log(mongoURI);

const mdclient = new MongoClient(mongoURI);
mdclient.connect();

app.get('/', function(req, res) {
	
});




const server = http.listen(8080, function() {
    dbList =  mdclient.db().admin().listDatabases();
    console.log(dbList);
    console.log('listening on *:8080');
});
