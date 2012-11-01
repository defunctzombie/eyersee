var Panel = require('bamboo').widgets.Panel;
var App = require('bamboo').core.App;

var JoinServer = function(parent) {
    JoinServer.super.call(this, parent);
    var self = this;

    var ui = App.ui('ui/servers')(self);

    var join = function() {

        // hide the join server panel
        self.hide();

        // TODO read from some input box
        var host = 'irc.freenode.net';
        var username = ui.username.value();

        self.emit('connect', host, username);
    };

    ui['connect-form'].on('submit', join);
    ui.connect.on('click', join);

    /*
    // emitted when the widget is shown
    self.on('show', function() {

        // refresh server list
    });
    */
};
Panel.extend(JoinServer);

module.exports = JoinServer;

