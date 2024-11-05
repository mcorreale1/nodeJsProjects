const axios = require('axios');
const cheerio = require('cheerio');
const config = require ('./config.json');
const {Client, GatewayIntentBits, Events, EmbedBuilder} = require('discord.js');
const discKey = config['DISCORD'];
const URLData = require('./leaderboards.json');
var entFile = require('./ent')

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent]}
);
function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
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

    const embed = await entFile.generateEmbed(params);
    interaction.channel.send({
        
        embeds: [embed]
    });
});

client.login(discKey);
