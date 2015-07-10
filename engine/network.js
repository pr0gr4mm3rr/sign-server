var WebSocketServer = require('ws').Server;
var config = require('./config');
var log = require('log4js').getLogger('network');

var wss;
require('../wss')(function (server) {
    wss = new WebSocketServer({
        server: server,
        path: config.network.path
    });
    wss.on('connection', onConnection);
});

var methods = {};

var registerMethod = module.exports.registerMethod = function registerMethod(name, method) {
    if (methods.hasOwnProperty(name))
        throw new Error('Websocket method already exists');

    if (typeof method !== 'function')
        throw new Error('Websocket method must be a function');

    if (method.length !== 2)
        throw new Error('Websocket method bust be as method(client, data)');

    methods[name] = method;
};

function onConnection(ws) {
    new WebsocketClient(ws);
}

var WebsocketClient = module.exports.WebsocketClient = function WebsocketClient(ws) {
    this.ws = ws;
    ws.on('message', this.onMessage.bind(this));
    ws.on('close', this.onClose.bind(this));
    ws.on('error', this.onError.bind(this));
    this.channels = [];

    log.debug('Websocket server got a client');
};

WebsocketClient.prototype.onMessage = function (message) {
    // Attempt to parse
    var data;
    try {
        data = JSON.parse(message);
    } catch (e) {
        log.warn('Websocket client sent a malformed message');
        log.debug(message);
        return this.send('error', {
            msg: 'We couldn\'t understand that message'
        });
    }

    if (!data.cmd) {
        log.warn('Websocket client sent a message without a cmd');
        log.debug(message);
        return this.send('error', {
            msg: 'Messages must include a command'
        });
    }

    if (!methods.hasOwnProperty(data.cmd)) {
        log.warn('Websocket client sent a bad cmd');
        log.debug(message);
        return this.send('error', {
            msg: 'Unrecognized command'
        });
    }

    methods[data.cmd](this, data);
};

WebsocketClient.prototype.onClose = function (evt) {
    // Unregister from channels
    console.log(this.channels);
    for (var i = 0; i < this.channels.length; i ++)
        this.channels[i].unregisterClient(this);
};

WebsocketClient.prototype.onError = function (err) {
    log.error('Websocket object received an error: ' + err);
};

WebsocketClient.prototype.send = function (cmd, data) {
    if (data !== undefined && typeof data !== 'object')
        throw new Error('Websocket client tried to send non-object');

    data = data || {};
    data.cmd = cmd;

    var message = JSON.stringify(data);

    this.ws.send(message);
};

// Test method

registerMethod('ping', function (client, data) {
    client.send('pong');
});

registerMethod('help', function(client, data) {
    var msg = 'The following commands are available:\n  ';
    msg += Object.keys(methods).join(', ');
    
    client.send('log', {msg: msg});
});