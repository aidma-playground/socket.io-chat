var io = require('socket.io')();
var DateUtil = require('date-utils');
var Database = require("nedb");
var db = new Database({
    filename: "./db/chat_log",
    autoload: true
});
var users = {}

io.on('connection', function(client){
    console.log('%s user connection', client.id);

    client.loggedIn = false;

    client.on('user login', function(name, max_output_log) {
        if (!(name in users)) {
            console.log('%s user login as "%s"', client.id, name);

            client.loggedIn = true;

	    // タイムスタンプ降順でDBからログを取得
	    // ログインユーザの画面へ取得したログを昇順に表示させる
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
