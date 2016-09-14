var io = require('socket.io-client');
var socket = io('http://localhost:3000');
var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('close', function() {
    process.exit(0);
});

var askUserName = function askUserName() {
    rl.setPrompt('Enter username> ');
    rl.prompt();
    
    rl.once('line', function(line) {
        socket.emit('user login', line.trim());
    });
};

socket.on('login', function() {
    rl.setPrompt('> ');
    rl.prompt();

    rl.on('line', function(line) {
        socket.emit('say', line.trim());
        rl.prompt();
    });
});

socket.on('username dup', function(name) {
    console.log('*** Username "' + name + '" is used');
    askUserName(rl);
});

socket.on('say', function(data) {
    process.stdout.cursorTo(0);
    console.log('%s: %s', data.name, data.message);
    rl.prompt(true);
});

askUserName();
