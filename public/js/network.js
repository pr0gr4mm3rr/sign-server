// WebSocket networking stuff
var net = {
    // config
    host: location.host,
    port: 8000,
    path: '/ws/template',
    
    socket: null,
    minBackOff: 0.25,
    backOff: 1,
    handles: {},
    connect: function (cb) {
        net.doConnect(function () {
            if (typeof cb === "function")
                cb();
        }, function attemptReconnect() {
            // Attempt reconnect
            
            setTimeout(function () {
                net.doConnect(function () {
                    if (typeof this.onreconnect === 'function')
                        this.onreconnect(this);
                    // Reset reconnect exponential backoff counter
                    net.backOff = net.minBackOff;
                    // Re-subscribe to channels
                    net.resubscribe();
                }, attemptReconnect);
            }, net.backOff * 1000);
            net.backOff *= 2;
        });
    },
    doConnect: function (onConnect, onClose) {
        try {
            this.socket = new WebSocket('ws://' + this.host + ':' + this.port + this.path);
        } catch (e) {
            return console.log(e);
        }
        // Forward events appropriately
        this.socket.onopen = onConnect;
        this.socket.onclose = onClose;
        this.socket.onmessage = this.handle;
    },
    on: function (command, callback) {
        this.handles[command] = callback;
    },
    handle: function (msg) {
        try {
            var json = JSON.parse(msg.data);
        } catch (e) {
            throw new Error("Network received malformed message");
        }

        if (!json.cmd)
            throw new Error("Network received commandless message");

        if (!net.handles.hasOwnProperty(json.cmd))
            throw new Error("Network received bad command");
        
        net.handles[json.cmd](json);
            
    },
    send: function (data) {
        if (typeof data === "object")
            data = JSON.stringify(data);
        if (this.socket && this.socket.readyState)
            this.socket.send(data);
        else
            throw new Error("Network send attempted under incorrect conditions");
    },
    call: function (cmd, data) {
        if (!cmd)
            throw new Error("Network attempted call without command");
        data = data || {};
        data.cmd = cmd;
        this.send(data);
    },
    subscriptions: {},
    subscribe: function(channel, callback) {
        net.subscriptions[channel] = callback;
        net.on('announce', function(data) {
            if (net.subscriptions.hasOwnProperty(data.channel))
                net.subscriptions[data.channel](data);
            else
                console.log("Got channel message for unknown channel %s", data.channel);
        });
        net.call('subscribe', {
            channel: channel
        });
    },
    resubscribe: function() {
        for (var i in net.subscriptions)
            net.call('subscribe', {
                channel: i
            });
    }
};

net.on('error', function(data) {
    console.log("Server reported an error:", data);
});