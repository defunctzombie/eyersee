var Widget = require('bamboo').widgets.Widget;
var App = require('bamboo').core.App;

var moment = require('moment');

var ChatRoom = function(parent, element, channel) {
    ChatRoom.super.call(this, parent, element);
    var self = this;

    self.channel = channel;

    var ui = App.ui('ui/ChatRoom')(self);

    var msg_input = ui['message-input'];
    var chat_messages = ui['chat-messages'];

    // saved so they can be removed for memory
    // TODO(shtylman) remove old messages
    var msgs = [];

    function add_chat_message(from, msg) {
        var message = ui.ui['chat-message'](ui['chat-messages']);

        message.timestamp.text(moment().format('HH:mm'));
        message.nick.text(from + ':');
        message.msg.text(msg);

        // TODO(shtylman) push line widget to be able to remvoe it later
        //msgs.push(message_widget);

        // scroll to bottom of the chat messages
        // TODO(shtylman) should not have to access _elem
        chat_messages._elem.scrollTop = chat_messages._elem.scrollHeight;
    }

    function add_message(msg) {
        var message = ui.ui['chat-message'](ui['chat-messages']);

        message.timestamp.text(moment().format('HH:mm'));
        //message.nick.text();
        message.msg.text(msg);

        chat_messages._elem.scrollTop = chat_messages._elem.scrollHeight;
    }

    ui['message-form'].on('submit', function(event) {

        var msg = msg_input.value();

        // clear the value
        msg_input.value('');

        // if leading '/' then send as msg verbatim
        if (msg.charAt(0) === '/') {
            return channel.send(msg.slice(1));
        }

        // say what you mean, mean what you say ;)
        channel.say(msg);

        // TODO(shtylman) our nick name?
        add_chat_message('me', msg);
    });

    self.add_class('chat-room');

    channel.on('privmsg', function(msg) {
        var from = msg.nick;
        add_chat_message(from, msg.args[1]);

        // notify outsiders that we got a new message
        self.emit('msg');
    });

    channel.on('mode', function(msg) {
        console.log(msg);
        add_message('Mode: ' + msg.args.join(' '));
    });

    channel.on('joined', function(nick) {
        // TODO(shtylman) user joined
    });
};
// make ChatRoom a widget
Widget.extend(ChatRoom);

module.exports = ChatRoom;
