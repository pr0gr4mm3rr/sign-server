var socket = require('./network');

var SignManager = require('./SignManager');
var Sign = require('./Sign');

module.exports.start = function() {
  // Off we go

  // Register our network methods
  // These should come from a sign-client
  // TODO seperate into seperate websocket so web and signs aren't in the same command space
  socket.registerMethod('registertemp', function(client, data) {
    console.log('someone did registertemp as %s', data.name);
    var tempSign = new Sign(data.name, 'PENDING', client);
    SignManager.registerSign(tempSign);
  });
};
