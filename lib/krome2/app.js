
var EventEmitter = require('events').EventEmitter;

var Widget = require('./src/views/Widget');

App = function(opt) {
    var self = this;

    self.ui_files = opt.ui;

    // ui file name -> content
    self._loaded = {};

    App._loaded = self._loaded;
};
inherits(App, EventEmitter);

App.prototype.init = function() {
    var self = this;

    var files = self.ui_files;
    var count = 0;

    (function next(err) {
        if (err) {
            console.error(err);
        }

        if (count >= files.length) {
            return self.emit('init');
        }

        var file = files[count++];
        self.load(file + '.html', function(err, content) {
            if (err) {
                return next(err);
            }

            self._loaded[file] = content;
            next();
        });
    })();
};

// wrap a dom element as a ui widget
function elem_to_widget(elem) {
    var $elem = $(elem);

    var widgets = {};
    var bindings = {};

    $elem.find('[data-widget-id]').each(function(idx, elem) {
        var id = $(elem).attr('data-widget-id');
        var class_name = $(elem).attr('data-widget');

        var custom = custom_widgets[class_name];
        if (class_name && !custom) {
            console.error('no custom class for: ' + class_name);
        }

        var widget_class = custom || Widget;

        widget = new widget_class($(elem));
        widgets[id] = widget;
    });

    $elem.find('[data-widget-bind]').each(function(idx, elem) {
        var $elem = $(elem);
        var name = $elem.attr('data-widget-bind');

        Object.defineProperty(bindings, name, {
            set: function(val) {
                $elem.text(val);
            }
        });
    });

    return widgets;
};

// traverse the ui/*
// and load up all of the elements

/// load the given file
App.prototype.load = function(path, cb) {
    $.get(path, function(data) {
        cb(null, data);
    });
};

// ui is what actually contains the variables we can access?
// we can access
//var ui = App.ui(name);
// this will render those object onto a widget
// note that changing ui fields, etc
//ui.render(widget);
//data bindings should be on top of the ui layer?

App.widget = function(name) {
    var content = App._loaded[name];
    if (!content) {
        throw new Error('no template: ' + name);
    }

    var WidgetInstantiate = function (parent) {
        if (!(this instanceof WidgetInstantiate)) {
            return new WidgetInstantiate(parent);
        }
        WidgetInstantiate.super.call(this, parent);

        var self = this;

        self._$base.html(content);
        self._ui = elem_to_widget(self._$base);
    };
    Widget.extend(WidgetInstantiate);

    return WidgetInstantiate;
};

