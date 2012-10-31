var Stream = require('stream');
var inherits = require('inherits');

var TextEncoder = require('../encoding').TextEncoder;

/// write utf8 strings into an ArrayBuffer stream
var Utf8ArrayWriteStream = function() {};
inherits(Utf8ArrayWriteStream, Stream);

Utf8ArrayWriteStream.prototype.write = function(str) {
    var self = this;
    self.writable = true;
    self.readable = true;

    var uint8array = TextEncoder('utf-8').encode(str);
    self.emit('data', uint8array.buffer);

    return self;
};

module.exports = Utf8ArrayWriteStream;

