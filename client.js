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

function put_15logs(logs){
    for(var i=14;i>=0;--i){
	console.log('%s: %s',logs[i].name,logs[i].msg);
    }
}

function log() {
    process.stdout.cursorTo(0);
    console.log.apply(this, arguments);
    rl.prompt(true);
};

socket.on('login', function(users/*, logs*/) {
    var usernames = []
    for (var k in users) {
        usernames.push(k);
    }

    console.log('members: %s', usernames.join(', '));

    // ログを出力する関数を呼ぶ
    // put_15logs(logs);

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

socket.on('user enter', function(name) {
    log('--- %s entered', name);
});

socket.on('user leave', function(name) {
    log('--- %s left', name);
});

socket.on('say', function(data) {
    log('%s: %s', data.name, data.message);
});

askUserName();
