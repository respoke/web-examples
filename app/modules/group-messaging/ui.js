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

    /**
     * Compiled Handlebars templates
     * @type {{authForm: *, groupMessage: *, chatTabs: *, buddies: *, chatList: *}}
     */
    var TEMPLATE = {
        authForm: Handlebars.compile($('#auth-form-template').text()),
        groupMessage: Handlebars.compile($('#group-message-template').text()),
        chatTabs: Handlebars.compile($('#chat-tabs-template').text()),
        buddies: Handlebars.compile($('#buddies-template').text()),
        chatList: Handlebars.compile($('#chat-list-template').text())
    };

    /**
     * The UI module
     * @type {Object}
     */
    var ui = App.ui = (App.ui || {});

    /**
     * The root UI element
     * @type {HTMLElement}
     */
    ui.$ui = $('#ui');

    /**
     * The authentication module
     */
    ui.auth = function () {
        ui.$ui.empty();
        ui.$ui.append(TEMPLATE.authForm({}));

        /**
         * The auth.authform submodule
         */
        ui.auth.authForm = (function () {
            var $el = ui.$ui.find('.authentication'),
                $username = $el.find('.cbl-name__text');

            function onAuthFormSubmit(e) {
                e.preventDefault();
                var username = $username.val();
                App.state.login(username);
            }

            $el.on('submit.authForm', onAuthFormSubmit);

            return {
                dispose: function () {
                    $el.off('.authForm');
                    $el = null;
                    $username = null;
                }
            };
        }());

        ui.auth.dispose = function () {
            ui.auth.authForm.dispose();
            ui.auth.authForm = null;
            ui.$ui.empty();
        };
    };

    /**
     * The group message module
     */
    ui.groupMessage = function () {
        ui.$ui.empty();
        ui.$ui.append(TEMPLATE.groupMessage({
            username: App.state.loggedInUser
        }));

        /**
         * The groupMessage.tabs submodule
         */
        ui.groupMessage.tabs = (function () {
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

            $el.on('click.tabs', '.tab', onTabClicked);
            $el.on('click.tabs', '.close', onCloseClicked);

            App.state.listen('tab.opened', render);
            App.state.listen('tab.closed', render);
            App.state.listen('tab.activated', render);

            return {
                dispose: function () {
                    $el.off('.tabs');
                    App.state.ignore('tab.opened', render);
                    App.state.ignore('tab.closed', render);
                    App.state.ignore('tab.activated', render);
                }
            };
        }());

        /**
         * The groupMessage.messages submodule
         */
        ui.groupMessage.messages = (function () {
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

            return {
                dispose: function () {
                    App.state.ignore('tab.opened', onTabOpened);
                    App.state.ignore('tab.closed', onTabClosed);
                    App.state.ignore('tab.activated', onTabActivated);
                }
            };
        }());

        /**
         * The groupMessage.buddies submodule
         */
        ui.groupMessage.buddies = (function () {
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

            $el.on('click.buddies', '.buddy-list--mini__user', onUserClicked);

            App.state.listen('buddies.updated', render);
            App.state.listen('buddy.activated', render);

            return {
                dispose: function () {
                    $el.off('.buddies');
                    App.state.ignore('buddies.updated', render);
                    App.state.ignore('buddy.activated', render);
                }
            };
        }());

        /**
         * The groupMessage.chat submodule
         */
        ui.groupMessage.chat = (function () {
            var $el = $('.group-chat__form');

            return {
                dispose: function () {}
            };
        }());

        /**
         * Handles the logout event
         * @param {Event} e
         */
        function onLogOut(e) {
            e.preventDefault();
            App.state.logout();
        }

        ui.$ui.on('click.groupMessage', '.logout', onLogOut);

        /**
         * Disposes the groupMessage module and all of its submodules
         */
        ui.groupMessage.dispose = function() {
            ['tabs', 'messages', 'buddies', 'chat'].forEach(function (module) {
                ui.groupMessage[module].dispose();
                ui.groupMessage[module] = null;
            });
            ui.$ui.off('.groupMessage');
            ui.$ui.empty();
        };
    };

    /**
     * Handles the init.success event
     */
    function onInitSuccess() {
        App.state.ignore('init.success', onInitSuccess);
        ui.auth();
    }

    /**
     * Handles the auth.success event
     */
    function onAuthSuccess() {
        App.state.ignore('auth.success', onAuthSuccess);
        ui.auth.dispose();
        ui.groupMessage();
        App.state.loadRoster();
    }

    App.state.listen('init.success', onInitSuccess);
    App.state.listen('auth.success', onAuthSuccess);

}(App, jQuery, Handlebars));