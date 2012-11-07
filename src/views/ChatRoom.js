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

    ui['message-form'].on('submit', function(event) {

        var msg = msg_input.value();

        // we won't see our own messages, so we need to add them
        // TODO(shtylman) our nick name?
        add_chat_message('me', msg);

        // say what you mean, mean what you say ;)
        channel.say(msg);

        // clear the value
        msg_input.value('');
    });

    self.add_class('chat-room');

    channel.on('msg', function(from, msg) {

        add_chat_message(from, msg);

        // notify outsiders that we got a new message
        self.emit('msg');
    });
};
// make ChatRoom a widget
Widget.extend(ChatRoom);

module.exports = ChatRoom;
