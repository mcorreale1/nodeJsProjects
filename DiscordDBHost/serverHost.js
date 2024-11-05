const express = require('express');
const app = express();
const chatCommands = require('./chatCommand.js');
const fs = require('fs');
const path = require('path');

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoURI = fs.readFileSync('./conf.txt', 'utf-8').toString();
const mdclient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
mdclient.connect();
const steam = require('steam-js-api');
const config = require('./config.json');
const lbId = '10158952';
const appId = '2226160';


app.get('/', async function(req, res) {
    db =  mdclient.db("nyFutureBot");
    col = db.collection("lbRequests");
    const doc = {
            user:req.query.user,
            createdDate: new Date()
    };

        //const result = await col.insertOne(doc);

     result = '';
        console.log(config['STEAM']);
     steam.request(
        'ISteamLeaderboards/GetLeaderboardEntries/v1', 
         {
            key: config['STEAM'],
            appid: appId,
            leaderboardid: lbId,
            rangestart: 0,
            rangeend: 5,
            datarequest: 1
         },
         rt => {
            console.log(rt);
            result = (rt);
         }
     );
               
    console.log(result);
    res.send(result);

           

});




const server = app.listen(8080, function() {
    steam.setKey(config['STEAM']);

    

    console.log('listening on *:8080');
});

