var Widget = require('bamboo').widgets.Widget;
var App = require('bamboo').core.App;

var ChannelList = function(parent, element) {
    ChannelList.super.call(this, parent, element);

    var self = this;
    self.rooms = {};
};
Widget.extend(ChannelList);

ChannelList.prototype.set_model = function(list_model) {
    var self = this;

    var rooms = self.rooms;

    var active;

    var ListItem = App.ui('ui/ChannelItem');

    list_model.on('added', function(room) {

        // add the widget to ourselves
        var li = ListItem(self);

        // set display items
        li.name.text(room.name);

        room.room.on('msg', function() {
            if (!active) {
                return;
            }

            if (active.name === room.name) {
                return;
            }

            li.name.add_class('unread');
        });

        // no unread messages yet
        li.unread.hide();
        li.unread.text(0);

        var ui = li['channel-item'];

        self.on('selected', function(item) {
            if (item.name !== room.name) {
                return ui.remove_class('selected');
            }

            ui.add_class('selected');

            active = item;

            // reamove unread notification when activating the room
            li.name.remove_class('unread');
        });

        li.leave.on('click', function() {
            // TODO
            // leave the channel (wait for part msg?)
            // unregister event handlers
            ui.remove();

            // ask the room to close itself
            room.close();

            var next = Object.keys(rooms).shift();
            if (next) {
                // TODO(shtylman) simulate click? select next item?
                //rooms[next].click();
            }

            // remove the room
            delete rooms[room];
        });

        ui.on('click', function(ev) {
            // TODO(shtylman) already selected?
            self.select(room);
        });

        rooms[room] = li;
    });

    list_model.on('removed', function(room) {
        var li = rooms[room];

        // remove ourselves
        // hm... this is complex since again.. li isn't one item that was added
        //li.remove();
    });
};

ChannelList.prototype.select = function(room) {
    var self = this;

    // check if we know about this room
    var li = self.rooms[room];
    if (!li) {
        return;
    }

    self.emit('selected', room);
};

module.exports = ChannelList;

