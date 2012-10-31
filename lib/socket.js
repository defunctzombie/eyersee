var Stream = require('stream');
var inherits = require('inherits');

var Socket = function() {
    var self = this;

    self.writable = true;
    self.readable = true;

    self.socket_id = -1;

    self.once('connect', function() {
        // start reading socket data once connected
        (function read() {
            chrome.socket.read(self.socket_id, null, function(read_info) {
                if (read_info.resultCode < 0) {
                    self.emit('error', new Error('tcp read failed: ' + read_info.resultCode));
                    return ;
                }

                self.emit('data', read_info.data);

                // read again
                read();
            });
        })();
    });
};
inherits(Socket, Stream);

/// write {ArrayBuffer} data to the socket
Socket.prototype.write = function(data) {
    var self = this;
    chrome.socket.write(self.socket_id, data, self._write_complete.bind(self));
};

/// write {ArrayBuffer} data and then end connection
Socket.prototype.end = function(data) {
    chrome.socket.disconnect(self.socket_id);

    self.emit('end');
    self.emit('close');
};

/// connect to the given port and host
Socket.prototype.connect = function(port, host) {
    var self = this;

    chrome.socket.create('tcp', {}, function(createInfo) {
        self.socket_id = createInfo.socketId;

        chrome.socket.connect(createInfo.socketId, host, port, function(error_code) {
            if (error_code < 0) {
                self.emit('error', new Error('unable to connect to: ' + host + ':' + port));
                return;
            }

            // connected
            self.emit('connect');
        });
    });
};

Socket.prototype._write_complete = function(write_info) {
    var self = this;
    if (write_info.bytesWritten <= 0) {
        self.emit('error', new Error('tcp socket write error'));
    }
};

/// events
//connect
//data
//end
//timeout
//drain
//error
//close

// set encoding?

module.exports = Socket;

