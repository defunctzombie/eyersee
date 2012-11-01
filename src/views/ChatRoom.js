var Panel = require('bamboo').widgets.Panel;
var App = require('bamboo').core.App;

var moment = require('moment');

var ChatRoom = function(parent, channel) {
    ChatRoom.super.call(this, parent);
    var self = this;

    self.channel = channel;

    var ui = App.ui('ui/ChatRoom')(self);

    ui['room-name'].text(channel.name);

    var msg_input = ui['message-input'];
    var chat_messages = ui['chat-messages'];

    // saved so they can be removed for memory
    // TODO(shtylman) remove old messages
    var msgs = [];

    function add_chat_message(from, msg) {
        var message_widget = new Panel(ui['chat-messages']);

        message_widget.add_class('chat-msg');

        // timestamp
        new Panel(message_widget)
            .text(moment().format('HH:mm'))
            .add_class('timestamp');

        // nick
        new Panel(message_widget)
            .text(from + ':')
            .add_class('nick');

        // message
        new Panel(message_widget)
            .text(msg)
            .add_class('msg');

        msgs.push(message_widget);

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
Panel.extend(ChatRoom);

module.exports = ChatRoom;
