var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var split = require('split');

var ArrayReadStream = require('abe').ArrayReadStream;
var ArrayWriteStream = require('abe').ArrayWriteStream;

var Socket = require('chrome-socket');

var Channel = require('./Channel');

// create a new IRC server
var IrcServer = function(host, port, username) {
    var self = this;

    var socket = self._socket = new Socket();
    self.host = host;
    self.port = port;

    // remember: pipe returns the last destination stream
    var read = socket.pipe(new ArrayReadStream('utf-8')).pipe(split(/\r?\n/));
    var write = self._write = new ArrayWriteStream('utf-8');

    // send the raw data of what we write to the socket
    write.pipe(socket);

    socket.on('connect', function() {
        self.emit('connected');
    });

    self.once('connected', function() {
        self.command('NICK', username);
        self.command('USER', username, '0', '*', username);
    });

    // room names -> channels for routing messages
    var channels = {};

    // message routing
    self.on('message', function(msg) {
        console.log('->', msg);
        self.emit(msg.cmd, msg);
    });

    self.on('ERROR', function(msg) {
        self.emit('error', new Error(msg.args.join(' ')));
    });

    self.on('PING', function(msg) {
        // TODO(shtylman) PONG
    });

    self.on('PRIVMSG', function(msg) {
        var target = msg.args[0];

        // malformed privmsg
        if (!target) {
            return;
        }

        var channel = channels[target];

        // TODO(shtylman) make new channel?
        if (!channel) {
        }

        // route message to channel
        channel._msg(msg);
    });

    self.on('PING', function(msg) {
        self.command('PONG', ':' + msg.args[0]);
    });

    self.on('MODE', function(msg) {
        var target = msg.args[0];

        if (target === self.username) {
            return;
        }

        // if the target is a channel, then pass the message to the channel
        var channel = channels[target];
        if (!channel) {
            return;
        }

        channel._msg(msg);
    });

    self.on('PART', function(msg) {
        var name = msg.args[0];

        var existing = channels[name];
        if (!existing) {
            return; // ??
        }

        existing.parted(name);
    });

    self.on('JOIN', function(msg) {
        var name = msg.args[0];

        var existing = channels[name];

        if (existing) {
            // new user joined the channel
            existing.joined(msg.nick);
            return;
        }

        var channel = new Channel(name);

        channel.on('PRIVMSG', function(msg) {
            self.command('PRIVMSG', name, ':' + msg);
        });

        channel.on('PART', function(reason) {
            self.command('PART', name, ':' + reason);

            delete channels[name];
            channel.removeAllListeners();
        });

        channel.on('RAW', function(msg) {
            self.send(msg);
        });

        channels[name] = channel;

        self.emit('joined', channel);
    });

    read.on('data', function(data) {
        //console.log('->', data);

        var match = data.match(/^(:[\S]+ )?([A-Z]+|[0-9]{3}) (.*)$/);
        if (!match) {
            self.emit('error', new Error('unrecognized message format: ' + data));
            return;
        }

        // first item is the full string
        match.shift();

        var prefix = match.shift();
        var cmd = match.shift();
        var params = match.shift();

        var msg = {
            raw: data,
            cmd: cmd,
        };

        // prefix captures training space
        if (prefix) {
            prefix = prefix.trim();
            msg.prefix = prefix;

            // detect if nick!user@host pattern
            var pmatch = prefix.match(/^:([^!]+?)!([^@]+)@(.+)$/);
            if (pmatch) {
                msg.nick = pmatch[1];
                msg.user = pmatch[3];
                msg.host = pmatch[4];
            }
            // otherwise just hostname
            else {
                // remove leading :
                msg.server = prefix.slice(1);
            }
        }

        var args = msg.args = [];

        // TODO(shtylman) some cool regex to do this crap
        // annoying cause of the varying nature of the params
        if (params) {
            params = params.split(' ');
            while (params.length) {
                var param = params.shift();
                if (param[0] === ':') {
                    params.unshift(param);
                    break;
                }

                args.push(param);
            }

            args.push(params.join(' ').slice(1));
        }

        self.emit('message', msg);
    });

    // its go time!
    self.connect();
};
inherits(IrcServer, EventEmitter);

IrcServer.prototype.connect = function() {
    var self = this;
    self._socket.connect(self.port, self.host);
    return this;
};

IrcServer.prototype.disconnect = function() {
    var self = this;
    self._socket.end();
    return this;
};

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
    return self.send(out);
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

