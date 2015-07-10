// A representation of a sign

var Sign = module.exports = function Sign(name, state, ws) {
  this.name = name;
  this.state = state;
  this.conn = ws || null;

  // Listen for close
  if (this.conn)
    this.conn.ws.on('close', function() {
      console.log('%s closed', this.name);
      this.state = "CLOSED";
    }.bind(this));
};
