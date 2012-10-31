var App = require('bamboo').core.App;
var List = require('bamboo').models.List;

var ChatRoom = require('./views/ChatRoom');
var ServerRoom = require('./views/ServerRoom');

var IrcServer = require('../lib/irc').Server;

var Main = function(parent) {
    var self = this;

    // hostnames we are connected to
    var servers = {};

    // render the ui onto parent and return the ui object
    // the ui object contains all of the widgets in the rendered ui
    var ui = self.ui = App.ui('ui/main')(parent);

    // list emits events when items are added or removed
    self.rooms_list = new List();
    ui['channel-list'].set_model(self.rooms_list);

    var active = null;

    // when a channel selection changes
    ui['channel-list'].on('selected', function(room) {
        if (active) {
            active.hide();
        }

        active = room.room;
        active.show();
    });

    self.rooms_list.on('added', function(room) {

        // room is hidden default;
        room.room.hide();

        // select the channel if nothing active
        if (!active) {
            ui['channel-list'].select(room);
        }
    });

    // TODO(shtylman) default server/username?

    // servers widget
    ui.servers.on('connect', function(host, username) {
        ui['channel-list'].show();

        self.new_connection(host, username);
    });

    // show the widget
    ui.servers.show();
    ui['channel-list'].hide();
};

Main.prototype.new_connection = function(host, username) {
    var self = this;
    var ui = self.ui;

    var port = 6667;
    var irc_server = new IrcServer(host, port, username);

    //self.servers[host] = irc_server;

    irc_server.on('joined', function(channel) {
        var room = new ChatRoom(ui['chat-panel'], channel);

        self.rooms_list.add({
            name: channel.name,
            unread: 0,
            room: room,
        });
    });

    // for server messages
    var room = new ServerRoom(ui['chat-panel'], irc_server);

    // add a server room
    self.rooms_list.add({
        name: host,
        unread: 0,
        room: room,
    });

    irc_server.once('connected', function() {
        // need to make a room viewer for the server messages
    });
};

module.exports = Main;