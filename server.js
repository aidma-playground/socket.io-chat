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
            client.emit('login', users);

            users[name] = client.id;
            client.broadcast.emit('user enter', name);
        } else {
            console.log('%s username dup "%s"', client.id, name);

            client.emit('username dup', name);
        }
    });

    client.on('search', function(msg) {
        var target_msg = msg.replace(/^:s\s/,"");
        if (!client.loggedIn) {
            console.log('%s user search (***loggedIn=false): "%s"', client.id, target_msg);
            return;
        }

        console.log('%s user search: "%s"', client.id, target_msg);

        // 検索・出力処理
        // 検索にマッチするログを配列に格納し、その配列を引数に持たせてイベントを発火させる
        // 検索結果出力イベントが1つにまとまるため他者の発言等に割り込まれない

        // var limit_search_log = 100;
        var target_pattern = new RegExp(target_msg);
        db.find({'message':target_pattern}).sort({'date':1}).limit(/*limit_search_log*/).exec(function (err, LOG) {
	    client.emit('search_result', LOG);
	});
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
	var timestamp = dt.toFormat("YYYYMMDDHH24MISS");

	// nとmsgとtimestampをDBに格納
	var doc = {
	     name: n,
	     message: msg,
	     date: timestamp
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
