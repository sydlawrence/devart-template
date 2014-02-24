
/**
 * Module dependencies.
 */

var Twitter = require('twitter')
  , midi = require('midi')
  , config = require('./config').config
  , io = require('socket.io').listen(config.output_socket);
io.set('log level', 1);

/* MINISTRY OF SOUND CREDENTIALS */
var twit = new Twitter({
    consumer_key:         '5o8VmjHTSpPcpq2CnEXnw',
    consumer_secret:      'QJjuyljTgmK1uV3C74C06iaYBnKxxPpPqvpgACo',
    access_token_key:     '14860093-i5lSz8QnV9WjpOLWuRONhDTGN7e8kyivP6Nh0JzbM',
    access_token_secret:  'Fqf78nlIN6XOQpxxTDyXusfAp1m8AvmjlYrFtpOlUzU'
});


var sendTweets = false;

var onTweet = function(tweet) {
  try {
    if (sendTweets) io.sockets.emit("tweet",{tweet:tweet});
  } catch (e) {}
}

var sendTweets = false;

twit.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
        if (data.text) {
          onTweet({
            text: data.text,
            username: data.user.screen_name
          });
        }
    });
});


function createLaunchpad(name) {

  var midiPort = config.midiPort+name;

  // Set up a new output.
  var output = new midi.output();

  // Set up a new input.
  var input = new midi.input();

  // Open the first available output port.
  output.openPort(midiPort);
  input.openPort(midiPort);

  console.log("running port: "+output.getPortName(midiPort));

  var connections = [];

  io.sockets.on('connection', function (socket) {

    connections.push(socket);

    socket.on('disconnect', function() {
      connections.forEach(function(connection, i) {
        if (connection === socket) {
          connections.splice(i, 1);
        }
      });
    });

    // on new message
    socket.on('midijs', function (data) {
      if (data.message.name === name) {
        // expected sample:  {message:[175,22,1]}
        output.sendMessage(data.message.message);
      }
    });

    socket.on("tweet_start", function() {
      sendTweets = true;
    })
    socket.on("tweet_end", function() {
      sendTweets = false;
    })
  });

  // Configure a callback.
  input.on('message', function(deltaTime, message) {
    connections.forEach(function(connection) {
      connection.emit('midijs', { message: message, deltaTime:deltaTime, name:name });
    });
  });

  // Sysex, timing, and active sensing messages are ignored
  // by default. To enable these message types, pass false for
  // the appropriate type in the function below.
  // Order: (Sysex, Timing, Active Sensing)
  input.ignoreTypes(false, false, false);
}

var successes = 0;
for (var i = 0; i < config.arrangement[0]*config.arrangement[0]; i++) {
  try {
    createLaunchpad(i);
    console.log("success: "+i);
    successes++;
  } catch (e) {
    console.log("failed: "+i);
  }
}
console.log("successes: "+successes);
