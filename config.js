// A wrapper around config.json
// You can do like config.set('server.host', '1.2.3.4')
// or config.get('server.port')
// But you need a config.save() to commit

var fs = require('fs');

var data = fs.readFileSync('./config.json').toString();
var config = JSON.parse(data || '{}');

module.exports.get = function(field) {
  if (typeof field === 'undefined')
    return config;

  var sub = field.split('.');
  if (sub.length === 1) {
    return config[field] || null;
  } else {
    // Nesting
    var subset = config;
    var last = sub.pop();
    sub.forEach(function(s) {
      subset = subset[s] || {};
    });
    return subset[last] || null;
  }
};

module.exports.set = function(field, value) {
  var sub = field.split('.');
  if (sub.length === 1) {
    config[field] = value;
  } else {
    // Nesting
    var subset = config;
    var last = sub.pop();
    sub.forEach(function(s) {
      if (subset.hasOwnProperty(s))
        subset = subset[s];
      else
        subset = subset[s] = {};
    });
    subset[last] = value;
  }
};

module.exports.save = function(cb) {
  fs.writeFile('./config.json', JSON.stringify(config, null, 2), cb);
};
