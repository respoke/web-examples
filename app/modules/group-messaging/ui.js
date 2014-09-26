/*global Handlebars*/
(function groupMessagingUI (App, $, Handlebars) {
    'use strict';

    Handlebars.registerHelper('presenceClass', function (options) {
        var presence = options.fn(this);
        return $.helpers.getPresenceClass(presence);
    });

    Handlebars.registerHelper('gravatar', function (options) {
        var username = options.fn(this);
        return $.helpers.getAvatar(username);
    });

    var TEMPLATE = {
        buddies: Handlebars.compile($('#buddies-template').text()),
        chatListItem: Handlebars.compile($('#chat-list-item').text()),
        chatTabs: Handlebars.compile($('#chat-tabs-template').text())
    };

//    $.helpers.insertTemplate({
//        template: 'user-buddy',
//        data: data,
//        renderTo: $el.find('.buddy-list')
//    });

    var ui = App.ui = (App.ui || {});

    ui.tabs = (function () {
        var $el = $('.group-chat__header__tabs');

        function render() {
            var html = TEMPLATE.chatTabs({
               tabs: App.state.tabs
            });
            $el.empty();
            $el.append(html);
        }

        function onTabClicked(e) {
            var label = e.target.getAttribute('id');
            App.state.activateTab(label);
        }

        function onCloseClicked(e) {
            var label = $(e.target).parent().attr('id');
            App.state.closeTab(label);
        }

        $el.on('click', '.tab', onTabClicked);
        $el.on('click', '.close', onCloseClicked);

        App.state.listen('tab.opened', render);
        App.state.listen('tab.closed', render);
        App.state.listen('tab.activated', render);
    }());

    ui.messages = (function () {
        var $el = $('.messages');

        function onTabOpened() {
            // create new message pane
            // switch to new message panes
            // render new message pane
        }

        function onTabClosed() {
            // close message pane
            // switch to first message pane?
        }

        function onTabActivated() {
            // switch to active message panes
            // re-render active message pane
        }

        App.state.listen('tab.opened', onTabOpened);
        App.state.listen('tab.closed', onTabClosed);
        App.state.listen('tab.activated', onTabActivated);
    }());

    ui.buddies = (function () {
        var $el = $('.buddy-list--mini');

        function render() {
            var html = TEMPLATE.buddies({
                buddies: App.state.buddies
            });
            $el.empty();
            $el.append(html);
        }

        function onUserClicked(e) {
            var username = e.currentTarget.getAttribute('id');
            App.state.activateBuddy(username);
        }

        $el.on('click', '.buddy-list--mini__user', onUserClicked);

        App.state.listen('buddies.updated', render);
        App.state.listen('buddy.activated', render);
    }());

    ui.chat = (function () {
        var $el = $('.group-chat__form');
    }());

    // TODO: delete
//    ['Everyone', 'Alice', 'Bob', 'John', 'Steven'].forEach(function (username) {
//       ui.buddies.addBuddy(username);
//    });

}(App, jQuery, Handlebars));