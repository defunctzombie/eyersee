var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

var DummyChannel = function(name) {
    var self = this;
    self.name = name;

    setInterval(function() {
        self.emit('msg', 'user', 'hello stuff');
    }, 2000);
};
inherits(DummyChannel, EventEmitter);

DummyChannel.prototype.say = function(what) {
    // holla
};

DummyChannel.prototype.part = function(reason) {
};

DummyChannel.prototype.list = function() {
};

var Dummy = function() {
    var self = this;

    setTimeout(function() {
        self.emit('connected');
    }, 200);

    self.on('connected', function() {

        // server messages
        self.emit('msg', 'alkdsfjlasdf');

        var channel1 = new DummyChannel('#test-channel1');
        self.emit('joined', channel1);

        var channel2 = new DummyChannel('#test-channel2');
        self.emit('joined', channel2);

        var channel3 = new DummyChannel('#test-channel3');
        self.emit('joined', channel3);
    });
};
inherits(Dummy, EventEmitter);

Dummy.prototype.send = function(msg) {
    console.log('<-', msg);
};

// events
// connected
// joined
// cmd
// msg

module.exports = Dummy;
