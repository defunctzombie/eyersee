var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

var Channel = function(name) {
    var self = this;
    self.name = name;
};
inherits(Channel, EventEmitter);

Channel.prototype.say = function(what) {
    var self = this;
    self.emit('PRIVMSG', what);
    return self;
};

Channel.prototype.part = function(reason) {
    var self = this;
    self.emit('PART', reason);
    return self;
};

Channel.prototype.list = function() {
};

// handle privmsg
Channel.prototype._msg = function(msg) {
    var self = this;

    var from = msg.nick || msg.server;
    var message = msg.args[1];

    // incoming message
    self.emit('msg', from, message);
};

// events
// msg (from, msg)
// join (username)
// part (username)
// list (usernames)

module.exports = Channel;

