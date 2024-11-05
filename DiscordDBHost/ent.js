const URLData = require('./leaderboards.json');
const axios = require('axios');
const cheerio = require('cheerio');


module.exports = {



capitalize: function(s)
{
    return s[0].toUpperCase() + s.slice(1);
},

getLeaderboardURL: function(stage, num) {
   
    return 'https://steamcommunity.com/stats/2226160/leaderboards/' + URLData[stage][num];

},

 getLeaderboardData: async function(url) {
        
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
},
    formatOutput: function(param1, param2) {

    const steamDBUrl = getLeaderboardURL(params[1], params[2]);
    const lbData = getLeaderboardData(steamDBUrl);

    const formattedData = [];
    formattedData.push(':first_place: ' + lbData[0].substring(3));
    formattedData.push(':second_place: ' + lbData[1].substring(3));
    formattedData.push( ':third_place: ' + lbData[2].substring(3));

    for ( i of lbData.slice(3, 15)) 
        formattedData.push(i);

    const fieldData = formattedData.join("\r\n");

}

};
