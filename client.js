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

function askUserName() {
    rl.setPrompt('Enter username> ');
    rl.prompt();
    
    rl.once('line', function(line) {
        socket.emit('user login', line.trim());
    });
}

function log() {
    process.stdout.cursorTo(0);
    console.log.apply(this, arguments);
    rl.prompt(true);
};

socket.on('login', function(users) {
    var usernames = []
    for (var k in users) {
        usernames.push(k);
    }

    console.log('members: %s', usernames.join(', '));

    rl.setPrompt('> ');
    rl.prompt();
    rl.on('line', function(line) {
	if(line.match(/^:s\b/)){
	    socket.emit('search', line.trim());
        }else{
            socket.emit('say', line.trim());
	}
        rl.prompt();
    });
});

socket.on('username dup', function(name) {
    console.log('*** Username "' + name + '" is used');
    askUserName(rl);
});

socket.on('user enter', function(name) {
    log('--- %s entered', name);
});

socket.on('user leave', function(name) {
    log('--- %s left', name);
});

socket.on('say', function(data) {
    log('%s: %s', data.name, data.message);
});

socket.on('search_result', function(LOG){
    log('search result: output start');
    for(var i in LOG){
	log('%s: %s', LOG[i].name, LOG[i].message);
    }
    log('search result: output finish');
});

askUserName();
