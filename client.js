var io = require('socket.io-client');
var socket = io('http://localhost:3000');
var argv = require( 'argv' );
var readline = require('readline');

//コマンドラインオプションを定義
argv.option([
    {
    name: 'log',
    short: 'l',
    type: 'int',
    description: 'ログイン時に表示されるログ数を指定します',
    example: '"node client.js log --log=balue" or "node client.js -l value"'
    },
]);

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
        socket.emit('user login', line.trim(), max_output_log);
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

socket.on('show_log', function(data) {
    log('[ %s ] %s: %s', data.date, data.name, data.message);
});

var args = argv.run();
var max_output_log = 15;
if(args.options.log != undefined){
    max_output_log = args.options.log;
}
askUserName();
