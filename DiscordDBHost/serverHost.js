const express = require('express');
const app = express();
const chatCommands = require('./chatCommand.js');
const fs = require('fs');
const path = require('path');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoURI = fs.readFileSync('./conf.txt', 'utf-8').toString();
const mdclient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mdclient.connect();

app.get('/', async function(req, res) {
    db =  mdclient.db("nyFutureBot");
    col = db.collection("lbRequests");
    const doc = {
            user:req.query.user,
            createdDate: new Date()
    };

    const result = await col.insertOne(doc);


    console.log(result);
    res.send(result);

           

});




const server = app.listen(8080, function() {
    
    console.log('listening on *:8080');
});

