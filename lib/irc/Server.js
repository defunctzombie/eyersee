var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var split = require('split');

var Utf8ArrayReadStream = require('../stream').Utf8ArrayReadStream;
var Utf8ArrayWriteStream = require('../stream').Utf8ArrayWriteStream;

var Socket = require('../socket');

var Channel = require('./Channel');

// create a new IRC server
var IrcServer = function(host, port, username) {
    var self = this;

    var client = new Socket();

    // remember: pipe returns the last destination stream
    var read = client.pipe(new Utf8ArrayReadStream()).pipe(split(/\r?\n/));
    var write = self._write = new Utf8ArrayWriteStream();

    // send the raw data of what we write to the socket
    write.pipe(client);

    client.on('connect', function() {
        self.emit('connected');
    });

    self.once('connected', function() {
        self.command('NICK', username);
        self.command('USER', username, '0', '*', username);
    });

    // its go time!
    client.connect(port, host);

    // room names -> channels for routing messages
    var channels = {};

    // message routing
    self.on('command', function(prefix, cmd, params) {
        self.emit(cmd, prefix, params);
    });

    self.on('ERROR', function(prefix, params) {
        self.emit('error', new Error(params));
    });

    self.on('PING', function(prefix, params) {
    });

    self.on('PRIVMSG', function(prefix, params) {
        var match = params.match(/([\S]+) :(.*)/);

        var target = match[1];
        var msg = match[2];

        var channel = channels[target];

        // make new channel?
        if (!channel) {
        }

        // route message to channel
        channel._msg(prefix, msg);
    });

    self.on('JOIN', function(prefix, params) {
        var name = params;
        var channel = new Channel(name);

        channel.on('PRIVMSG', function(msg) {
            self.command('PRIVMSG', name, ':' + msg);
        });

        channel.on('PART', function(reason) {
            self.command('PART', name, ':' + reason);
        });

        channels[name] = channel;

        self.emit('joined', channel);
    });

    read.on('data', function(data) {
        //console.log('->', data);

        var match = data.match(/(:[\S]+ )?([A-Z]+|[0-9]{3}) (.*)/);
        if (!match) {
            self.emit('error', new Error('unrecognized message format: ' + data));
            return;
        }

        // first item is the full string
        match.shift();

        var prefix = match.shift();
        var cmd = match.shift();
        var params = match.shift();

        // prefix captures training space
        if (prefix) {
            prefix = prefix.trim();
        }

        self.emit('command', prefix, cmd, params);
    });
};
inherits(IrcServer, EventEmitter);

IrcServer.prototype.join = function(channel_name) {
    var self = this;

    self.command('JOIN', channel_name);
};

IrcServer.prototype.privmsg = function(to, msg) {
    var self = this;
};

/// read the given user typed message and generate an IRC command
IrcServer.prototype.send = function(msg) {
    var self = this;

    console.log('<-', msg);
    self._write.write(msg + '\r\n');

    return self;
};

/// cmd, ...
IrcServer.prototype.command = function(cmd) {
    var self = this;

    var out = Array.prototype.slice.call(arguments).join(' ');

    console.log('<-', out);

    self._write.write(out + '\r\n');
    return self;
};

var irc = {
    connect: function(host, port) {
        return new IrcServer(host, port);
    }
};

// events
// connected
// disconnected
// command (prefix, cmd, params)
// joined (channel)
//

module.exports = IrcServer;

