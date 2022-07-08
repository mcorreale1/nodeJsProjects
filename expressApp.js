const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World\n');
    console.log('New connection');
    res.end();
});

app.listen(3000, () => {console.log('Listening on 3000')});
