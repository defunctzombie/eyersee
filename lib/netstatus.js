var EventEmitter = require('events').EventEmitter;

var ev = new EventEmitter();

var prev = navigator.onLine;

setInterval(function() {
    var status = navigator.onLine;

    // unchanged
    if (status === prev) {
        return;
    }

    prev = status;
    ev.emit((status) ? 'online' : 'offline');
}, 1000);

module.exports = ev;

