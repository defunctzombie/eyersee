var App = require('bamboo').core.App;

var Main = require('./src/main');

var custom_widgets = {
    'src/views/ChannelList': require('./src/views/ChannelList'),
    'src/views/JoinServer': require('./src/views/JoinServer')
};

var ui_files = [
    'ui/main',
    'ui/ChannelItem',
    'ui/servers',
    'ui/ChatRoom'
];

var env = App.init({
    widgets: custom_widgets,
    ui: ui_files
});

// environment loaded
env.on('init', function() {

    // TODO(shtylman) chrome storage for user settings
    // username, autoconnect servers, etc?

    var main = new Main();
});
