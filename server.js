var io = require('socket.io')();
var DatUtil = require('date-utils');
var Database = require("nedb");
var db = new Database({
    filename: "./db/chat_log",
    autoload: true
});
var users = {}

io.on('connection', function(client){
    console.log('%s user connection', client.id);

    client.loggedIn = false;

    client.on('user login', function(name) {
        if (!(name in users)) {
            console.log('%s user login as "%s"', client.id, name);

            client.loggedIn = true;

	    // タイムスタンプ降順でDBからログを取得
	    // ログインユーザの画面へ取得したログを昇順に表示させる
	    var max_output_log=15;
	    db.find().sort({'date': -1 }).limit(max_output_log).exec(function (err, LOG) {
		LOG.reverse();
 		for(var i in LOG){
		    var timestamp = LOG[i].date.toFormat("MM/DD HH24:MI");
 		    client.emit('show_log', {message: LOG[i].message, name: LOG[i].name, date: timestamp});
		}
	    });

            client.emit('login', users); 

            users[name] = client.id;
            client.broadcast.emit('user enter', name);
        } else {
            console.log('%s username dup "%s"', client.id, name);

            client.emit('username dup', name);
        }
    });

    client.on('say', function(msg) {
        if (!client.loggedIn) {
            console.log('%s user say (***loggedIn=false): "%s"', client.id, msg);
            return;
        }

        console.log('%s user say: "%s"', client.id, msg);
        var n = '';
        for (var k in users) {
            if (users[k] == client.id) {
                n = k;
            }
        }
	// タイムスタンプを取得
	var dt = new Date();
	// nとmsgとdtをDBに格納
	var doc = {
	     name: n,
	     message: msg,
	     date: dt
	};
	db.insert(doc); 

        io.emit('say', {message: msg, name: n});
    });

    client.on('disconnect', function() {
        console.log('%s user disconnected', client.id);

        for (var k in users) {
            if (users[k] == client.id) {
                delete users[k];
                client.broadcast.emit('user leave', k);
                break;
            }
        }
    });
});

io.listen(3000);
