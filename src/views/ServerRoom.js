var Panel = require('bamboo').widgets.Panel;
var App = require('bamboo').core.App;

var moment = require('moment');

var ServerRoom = function(parent, server) {
    ServerRoom.super.call(this, parent);
    var self = this;

    var ui = App.ui('ui/ServerRoom')(self);

    var msg_input = ui['message-input'];
    var chat_messages = ui['chat-messages'];

    // saved so they can be removed for memory
    // TODO(shtylman) remove old messages
    var msgs = [];

    function add_message(msg) {
        var message_widget = new Panel(ui['chat-messages']);

        message_widget.add_class('chat-msg');

        // timestamp
        new Panel(message_widget)
            .text(moment().format('HH:mm'))
            .add_class('timestamp');

        // message
        new Panel(message_widget)
            .text(msg)
            .add_class('msg');

        msgs.push(message_widget);

        // scroll to bottom of the chat messages
        // TODO(shtylman) should not have to access _elem
        chat_messages._elem.scrollTop = chat_messages._elem.scrollHeight;
    }

    server.on('NOTICE', function(prefix, params) {
        add_message(params);
    });

    server.on('001', function(prefix, params) {
        add_message(params);
    });

    server.on('002', function(prefix, params) {
        add_message(params);
    });

    server.on('003', function(prefix, params) {
        add_message(params);
    });

    server.on('004', function(prefix, params) {
        add_message(params);
    });

    server.on('005', function(prefix, params) {
        add_message(params);
    });

    server.on('372', function(prefix, params) {
        add_message(params);
    });

    server.on('376', function(prefix, params) {
        add_message(params);
    });

    server.on('MODE', function(prefix, params) {
        add_message(params);
    });

    ui['message-form'].on('submit', function(event) {

        var msg = msg_input.value();

        // we won't see our own messages, so we need to add them
        add_message('me', msg);

        // say what you mean, mean what you say ;)
        server.send(msg);

        // clear the value
        msg_input.value('');
    });

    self.add_class('server-room');
};
// make ServerRoom a widget
Panel.extend(ServerRoom);

module.exports = ServerRoom;
