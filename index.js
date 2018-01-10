/*
When the server is connected, it greets the user and ask for a name.
  It tells how many other clients are connected
Upon typing in the name followed by Enter, the user is considered connected
When connected, users can receive & send messages to connected clients by typing & pressing Enter
*/

var net = require('net');

var count = 0, users = {};

//Creates the server
var server = net.createServer(function(conn) {
  //handle connection
  conn.write(
      '\n > Welcome to \033[92mnode-chat\033[39m!'
    + '\n > ' + count + ' other people are connected at this time.'
    + '\n > Please write your name and press Enter: '
  );
  count++;

  conn.setEncoding('utf8');

  var nickname;

  function broadcast(msg, exceptMyself) {
    for (var i in users) {
      if (!exceptMyself || i != nickname) {
        users[i].write(msg);
      }
    }
  }

  conn.on('data', function(data) {
    data = data.replace('\r\n', '');
    if (!nickname) {
      if (users[data]) {
        conn.write('\033[93m> Nickname already in use. Try again:\033[39m ');
        return;
      } else {
        nickname = data;
        users[nickname] = conn;

        broadcast('\033[90m > ' + nickname + ' joined the room\033[39m\n');
      }
    } else {
      // Otherwise consider it a chat message
      broadcast('\033[96m > ' + nickname + ':\033[39m' + data + '\n', true);
    }
  });

  conn.on('close', function() {
    count--;
    delete users[nickname];
    broadcast('\033[90m > ' + nickname + ' left the room\033[39m\n');
  });
});

//Listen
server.listen(3000, function() {
  console.log('\033[96m server listening on *:3000\033[39m');
});
