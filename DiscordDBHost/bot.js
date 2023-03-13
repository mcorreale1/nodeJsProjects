const axios = require('axios');
const cheerio = require('cheerio');
const config = require ('./config.json');
const {Client, GatewayIntentBits, Events, EmbedBuilder} = require('discord.js');
const discKey = config['DISCORD'];
const URLData = require('./leaderboards.json');

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]}
);
function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
};

function getLeaderboardURL(stage, num) {
   
    return 'https://steamcommunity.com/stats/2226160/leaderboards/' + URLData[stage][num];

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
    params = msg.split(/(\s+)/).reduce( (f,o)  => {
        if(o.trim().length > 0) {
            f.push(o.trim().toLowerCase());
        };
        return f;
    }, []);

    if(params.length != 3) return [];
    if(params[0] != "!ent") return [];
    if(!URLData.hasOwnProperty(params[1])) return [];
    if(!URLData[params[1]].hasOwnProperty(params[2])) return [];
    return params;
}

client.once(Events.ClientReady, async () => {
	console.log('Ready!');
});

client.on(Events.MessageCreate, async interaction => {
    if (interaction.content.charAt(0) != '!' || interaction.content.length > 25) return; 

    content =interaction.content.trim();
    params = getMessageParams(content);
    if (params.length != 3 ) return;
    console.log(params);

    const steamDBUrl = getLeaderboardURL(params[1], params[2]);
    const lbData = await getLeaderboardData(steamDBUrl);

    const formattedData = [];
    formattedData.push(':first_place: ' + lbData[0].substring(3));
    formattedData.push(':second_place: ' + lbData[1].substring(3));
    formattedData.push( ':third_place: ' + lbData[2].substring(3));

    for ( i of lbData.slice(3, 15)) 
        formattedData.push(i);

    const fieldData = formattedData.join("\r\n");
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
	    .setTitle(':trophy: Leaderboard Data for ' + capitalize(params[1]) + ' ' + params[2])
	    .setURL(steamDBUrl)
        .setThumbnail('https://cdn.akamai.steamstatic.com/steam/apps/2226160/header.jpg?t=1678061552')  
        .addFields(
            {name: " ", value: fieldData}
        )
        .setTimestamp()
        .setFooter({text:"(at) Mcore#1625 if this bot be ackin' weird"});

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
