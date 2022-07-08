const os = require('os');

var totalMemory = os.totalmem();
var freeMemory = os.freemem();

console.log('Mem: ' + totalMemory);
