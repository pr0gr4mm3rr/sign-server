var app = require('./app');
var http = require('http');

var server = http.createServer(app);

require('./wss')(server);
var engine = require('./engine');

app.listen(80);
server.listen(8000);

// Start up sign-server engine
engine.signserver.start();
