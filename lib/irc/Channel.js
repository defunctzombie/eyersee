var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

var Channel = function(name) {
    var self = this;
    self.name = name;

    // other users in the channel
    self.nicks = [];
};
inherits(Channel, EventEmitter);

Channel.prototype.say = function(what) {
    var self = this;
    self.emit('PRIVMSG', what);
    return self;
};

Channel.prototype.send = function(msg) {
    var self = this;
    self.emit('RAW', msg);
    return self;
};

Channel.prototype.part = function(reason) {
    var self = this;
    self.emit('PART', reason);
    return self;
};

Channel.prototype.list = function() {
};

/// new user joined the channel
Channel.prototype.joined = function(nick) {
    var self = this;
    self.emit('joined', nick);
    return self;
};

Channel.prototype.parted = function(nick) {
    var self = this;
    self.emit('parted', nick);
    return self;
};

// handle messages targets for this channel
Channel.prototype._msg = function(msg) {
    var self = this;
    self.emit('message', msg);
    self.emit(msg.cmd.toLowerCase(), msg);
};

// events
// msg (from, msg)
// join (username)
// part (username)
// list (usernames)

module.exports = Channel;

