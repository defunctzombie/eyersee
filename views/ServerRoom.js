var Widget = require('bamboo').widgets.Widget;
var App = require('bamboo').core.App;

var moment = require('moment');

var ServerRoom = function(parent, element, server) {
    ServerRoom.super.call(this, parent, element);
    var self = this;

    var ui = App.ui('ui/ChatRoom')(self);

    var msg_input = ui['message-input'];
    var chat_messages = ui['chat-messages'];

    // saved so they can be removed for memory
    // TODO(shtylman) remove old messages
    var msgs = [];

    function add_message(msg) {
        var message_widget = new Widget(ui['chat-messages'], null);

        message_widget.add_class('chat-msg');

        // timestamp
        new Widget(message_widget)
            .text(moment().format('HH:mm'))
            .add_class('timestamp');

        // message
        new Widget(message_widget)
            .text(msg.args.join(' '))
            .add_class('msg');

        msgs.push(message_widget);

        // scroll to bottom of the chat messages
        // TODO(shtylman) should not have to access _elem
        chat_messages._elem.scrollTop = chat_messages._elem.scrollHeight;
    }

    server.on('NOTICE', function(msg) {
        add_message(msg);
    });

    server.on('001', function(msg) {
        add_message(msg);
    });

    server.on('002', function(msg) {
        add_message(msg);
    });

    server.on('003', function(msg) {
        add_message(msg);
    });

    server.on('004', function(msg) {
        add_message(msg);
    });

    server.on('005', function(msg) {
        add_message(msg);
    });

    server.on('251', function(msg) {
        add_message(msg);
    });

    server.on('252', function(msg) {
        add_message(msg);
    });

    server.on('253', function(msg) {
        add_message(msg);
    });

    server.on('254', function(msg) {
        add_message(msg);
    });

    server.on('255', function(msg) {
        add_message(msg);
    });

    server.on('265', function(msg) {
        add_message(msg);
    });

    server.on('266', function(msg) {
        add_message(msg);
    });

    server.on('250', function(msg) {
        add_message(msg);
    });

    server.on('353', function(msg) {
        add_message(msg);
    });

    server.on('366', function(msg) {
        add_message(msg);
    });

    server.on('372', function(msg) {
        add_message(msg);
    });

    server.on('375', function(msg) {
        add_message(msg);
    });

    server.on('376', function(msg) {
        add_message(msg);
    });

    server.on('MODE', function(msg) {
        add_message(msg);
    });

    // if nothing handled the command, then inform the user
    server.on('message', function(msg) {
        if (server.listeners(msg.cmd).length > 0) {
            return;
        }

        //self.emit('error', new Error('unhandled command (' + msg.cmd + ') report to @defunctzombie plz'));
    });

    ui['message-form'].on('submit', function(event) {
        var msg = msg_input.value();

        // TODO(shtylman) show our requested messages?
        // if leading '/' then send as raw msg
        if (msg.charAt(0) === '/') {
            msg = msg.slice(1);
        }

        // say what you mean, mean what you say ;)
        server.send(msg);

        // clear the value
        msg_input.value('');
    });

    self.add_class('server-room');
};
// make ServerRoom a widget
Widget.extend(ServerRoom);

module.exports = ServerRoom;
