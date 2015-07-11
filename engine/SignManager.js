// A thing to manage sign objects
var Sign = require('./Sign');

// exportFunc our functions here
function exportFunc(func) {
  module.exports[func.name] = func;
}

exportFunc(registerSign);
exportFunc(unregisterSign);
exportFunc(unregisterSignByName);

exportFunc(getSign);
exportFunc(getPending);

// Start of actual code
// TODO see if this is a good pattern or not
var signs = [];
var signsByName = {};

function registerSign(sign) {
  // Just track it
  signs.push(sign);
  signsByName[sign.name] = sign;
}

function unregisterSign(sign) {
  // Untrack
  signs.splice(signs.indexOf(sign), 1);
  delete signsByName[sign.name];
}

function unregisterSignByName(name) {
  // Wraps around unregisterSign
  var sign = getSign(name);
  unregisterSign(sign);
}

function getSign(name) {
  if (signsByName.hasOwnProperty(name))
    return signsByName[name];
  else
    return null;
}

function getPending() {
  return signs.filter(function(e) {
    return e.state === 'PENDING';
  });
}
