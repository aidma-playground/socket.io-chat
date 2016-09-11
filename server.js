var io = require('socket.io')();
var users = {}

io.on('connection', function(client){
    console.log('%s user connection', client.id);

    client.on('user login', function(name) {
        console.log('%s user login as "%s"', client.id, name);

        if (!(name in users)) {
            users[name] = client.id;
            client.emit('login');
        } else {
            client.emit('username dup', name);
        }
    });

    client.on('say', function(msg) {
        console.log('%s user say: "%s"', client.id, msg);

        var n = '';
        for (var k in users) {
            if (users[k] == client.id) {
                n = k;
            }
        }
        io.emit('say', {message: msg, name: n});
    });

    client.on('disconnect', function() {
        console.log('%s user disconnected', client.id);

        for (var k in users) {
            if (users[k] == client.id) {
                delete users[k];
                break;
            }
        }
    });
});

io.listen(3000);
