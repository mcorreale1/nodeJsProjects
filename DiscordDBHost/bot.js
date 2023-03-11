const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const config = require ('./config.json');
const {Client, GatewayIntentBits, Events, EmbedBuilder} = require('discord.js');
const discKey = config['DISCORD'];
const lbdata = require('./leaderboards.json');




const port = 8080;

const app = express();

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]}
);

function getLeaderboardURL(stage, num) {
   
    return 'https://steamcommunity.com/stats/2226160/leaderboards/' + lbdata[stage][num];

};

async function getLeaderboardData(url) {
        
    mergeData = [];
    test = await axios.get(url).then( res => {
        const ch = cheerio.load(res.data);
        /*
        rawData = ch('#stats').find('.lbentry').text().replace(/\s\s+/g, '; ').split(";").filter( 
            e => e.trim().length > 0
        );*/

        //Better approach w/ reduce
        rawData = ch('#stats').find('.lbentry').text().replace(/\s\s+/g, '; ').split(";").reduce( 
            (f, o) =>  {
                if(o.trim().length > 0){
                    f.push(o.trim());
                };
                return f;
            }, []);
        
        while (rawData.length) {
            mergeData.push(rawData.splice(0,3).join(' '));
        };
        
        return 1;

    }).catch( err => console.log(err));

    return mergeData;


};

function getMessageParams(msg) {
    params = msg.split(/(\s+)/).filter(i => i.trim().length > 0);
    return params;
}


/*
axios.get('https://steamcommunity.com/stats/2226160/leaderboards/10159001').then(
        res => {
                const ch = cheerio.load(res.data);
                console.log(ch('#stats').find('.lbentry:first').text().replace(/\s\s+/g, '; '));

        }).catch (err => console.log(err));*/


client.once(Events.ClientReady, async () => {
	console.log('Ready!');
    lbURL = getLeaderboardURL('mind', '6');
    //console.log(await getLeaderboardData(lbURL));
});


client.on(Events.MessageCreate, async interaction => {
    
    if (interaction.content.charAt(0) != '!' || interaction.content.length > 25) return; 
    
    content =interaction.content.trim();
    params = getMessageParams(content);

    if (params.length != 3 || params[0] != "!entlb") return;
    console.log(params);
    const steamDBUrl = getLeaderboardURL(params[1], params[2]);
    const lbData = await getLeaderboardData(steamDBUrl);
    console.log(lbData);
    
    const fieldData = lbData.join("\r\n");

    console.log(fieldData);


    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
	    .setTitle('Leaderboard Data for ' + params[1] + ' ' + params[2])
	    .setURL(steamDBUrl)
        .addFields(
            {name: " ", value: fieldData}
        )
        .setTimestamp()
        .setFooter({text:"(at) Mcore if this bot be ackin' weird"});

	// ...
    interaction.channel.send({
        
        embeds: [embed]
    });
});

client.login(discKey);


/*
client.guilds.fetch().then( res => {
    console.log(res);
});
*/
