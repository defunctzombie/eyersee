var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');

var Widget = function(parent) {
    var self = this;
    var base = self._$base = $(parent) || $('<div>');

    base.on('click', function() {
        self.emit('click');
    });
};
inherits(Widget, EventEmitter);

Widget.prototype.show = function() {
    var self = this;

    self._$base.show();
    self.emit('show');
};

Widget.prototype.hide = function(how) {
    var self = this;

    switch (how) {
    case 'fade':
        self._$base.fadeOut();
        break;
    default:
        self._$base.hide();
    }
};

/// class functions

Widget.extend = function(child) {
    inherits(child, Widget);
};

module.exports = Widget;

