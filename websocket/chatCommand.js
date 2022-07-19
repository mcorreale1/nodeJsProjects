const cmd = new Map();
cmd.set("/help", "This is a simple chat server used for practicing nodeJs. The following commands are available: \n")

function checkMessage(message) {
    console.log(cmd.has(message));
    if(message.charAt(0) === '/') {
        return cmd.has(message) ? cmd.get(message) : "Error: Command not found: ${message}";
    };
    return null;
}

module.exports.checkMessage = checkMessage;
