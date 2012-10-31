var Stream = require('stream');
var inherits = require('inherits');

var TextDecoder = require('../encoding').TextDecoder;

/// emits utf-8 decoded values from an ArrayBuffer stream
/// the stream should emit 'data' events with ArrayBuffer
var Utf8ArrayReadStream = function(stream) {
    var self = this;
    self.writable = true;
    self.decoder = TextDecoder('utf-8');
};
inherits(Utf8ArrayReadStream, Stream);

/// {ArrayBuffer} data expected
Utf8ArrayReadStream.prototype.write = function(data) {
    var self = this;

    var str = self.decoder.decode(new Uint8Array(data), {stream:true});
    self.emit('data', str);
};

Utf8ArrayReadStream.prototype.end = function(data) {
    var self = this;

    var str = self.decoder.decode();
    if (str.length > 0) {
        self.emit('data', str);
    }

    self.emit('end');
};

module.exports = Utf8ArrayReadStream;
