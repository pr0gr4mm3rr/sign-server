var socket = require('./network');
var log = require('log4js').getLogger('webEngine');
var WebsocketClient = socket.WebsocketClient;

var Channel = module.exports = function Channel(name) {
    this.name = name;
    this.clients = [];
};

Channel.prototype.registerClient = function(client) {
    // TODO authentication
    if (!client instanceof WebsocketClient)
        throw new Error("Tried to register non-client to websocket channel");
    this.clients.push(client);
    if (typeof this.onclient === 'function')
        this.onclient(client);
};

Channel.prototype.unregisterClient = function(client) {
    var i = this.clients.indexOf(client);
    if (i === -1)
        return log.warn('Tried to unregister unregistered client');
    
    this.clients.splice(i, 1);
};

Channel.prototype.hasClient = function(client) {
    return this.clients.indexOf(client) !== -1;
};

Channel.prototype.send = function(data) {
    data.channel = this.name;
    for (var i = 0; i < this.clients.length; i ++) {
        var client = this.clients[i];
        client.send('announce', data);
    }
};

// Hooks for sockets
var channels = {};

socket.registerChannel = function (channel) {
    if (!channel instanceof Channel)
        throw new Error("Tried to register non-channel as channel");

    if (channels.hasOwnProperty(channel.name))
        throw new Error("Tried to register already registered channel");

    channels[channel.name] = channel;
};

socket.registerMethod('subscribe', function (client, data) {
    var channel = data.channel;
    if (!channels.hasOwnProperty(channel))
        return client.send('error', {
            msg: "Channel '" + channel + "' does not exist"
        });

    if (channels[channel].hasClient(client))
        return client.send('error', {
            msg: 'You are already subscribed to that channel: ' + channel
        });
    
    channels[channel].registerClient(client);
    client.channels.push(channels[channel]);
});

socket.registerMethod('unsubscribe', function(client, data) {
    var channel = data.channel;
    if (!channels.hasOwnProperty(channel))
        return client.send('error', {
            msg: "Channel '" + channel + "' does not exist"
        });
    
    if (!channels[channel].hasClient(client))
        return; // Guess they /really/ didn't want to be there
    
    channels[channel].unregisterClient(client);
    var i = client.channels.indexOf(channels[channel]);
    client.channels.splice(i, 1);
});