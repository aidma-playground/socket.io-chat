var io = require('socket.io')();
var users = {}

io.on('connection', function(client){
    console.log('%s user connection', client.id);

    client.loggedIn = false;

    client.on('user login', function(name) {
        if (!(name in users)) {
            console.log('%s user login as "%s"', client.id, name);

            users[name] = client.id;

            client.loggedIn = true;
            client.emit('login');
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
