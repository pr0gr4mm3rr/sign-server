var _server;

var calls = [];

module.exports = function(server) {
    if (typeof _server !== 'undefined') {
        return server(_server);
    }
    if (typeof server === 'function') {
        if (typeof _server !== 'undefined') server(_server);
        else calls.push(server);
    }
    else if (typeof server !== 'undefined') {
        _server = server;
        if (calls.length) {
            for (var i in calls) calls[i](server);
        }
    }
    return _server;
};