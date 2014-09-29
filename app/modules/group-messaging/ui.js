/*global Handlebars, moment*/
(function groupMessagingUI (App, $, Handlebars, moment) {
    'use strict';

    Handlebars.registerHelper('presenceClass', function (options) {
        var presence = options.fn(this);
        return $.helpers.getPresenceClass(presence);
    });

    Handlebars.registerHelper('gravatar', function (options) {
        var username = options.fn(this);
        return $.helpers.getAvatar(username);
    });

    Handlebars.registerHelper('friendlyTime', function (options) {
        var timestamp = Number(options.fn(this));
        var now = moment(timestamp);
        return now.format('MM/DD/YYYY');
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
        chatMessages: Handlebars.compile($('#chat-messages-template').text())
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

        ui.groupMessage.menu = (function () {
            var $openButton = $('.group-list-open'),
                $closeButton = $('.group-list-close');

            function checkStatus () {
                if ($('.group-list').length) {
                    openMenu();
                } else {
                    closeMenu();
                }
            }

            function hideMenu (e) {
                var $openedMenu = $(e.target)
                    .closest('.group-list--is-open');

                if (!$openedMenu.length) {
                    return;
                }

                if (e.target !== $openButton[0]) {
                    closeMenu();
                }
            }

            function openMenu() {
                // ugh why
                $('html, body').animate({
                    scrollTop: 0
                }, 500);

                $('.group-list')
                    .removeClass('group-list')
                    .addClass('group-list--is-open');
                $('.group-chat')
                    .removeClass('group-chat')
                    .addClass('group-chat--open-panel');
            }

            function closeMenu () {
                $('.group-list--is-open')
                    .removeClass('group-list--is-open')
                    .addClass('group-list');
                $('.group-chat--open-panel')
                    .addClass('group-chat')
                    .removeClass('group-chat--open-panel');
            }

            $openButton.on('click.menu', checkStatus);
            $closeButton.on('click.menu', closeMenu);
            ui.$ui.on('click.menu touchstart.menu', hideMenu);

            return {
                dispose: function () {
                    $openButton.off('.menu');
                    $closeButton.off('.menu');
                    ui.$ui.off('.menu');
                    $openButton = $closeButton = null;
                }
            };
        }());

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
            var $el = $('.group-chat');

            function render() {
                var html = TEMPLATE.chatMessages({
                    messages: App.state.activeMessages()
                });
                $el.empty();
                $el.append(html);
            }

            function onTabActivated() {
                render();
            }

            function onTabDeactivated() {
                render();
            }

            function onMessageAdded() {
                render();
            }

            App.state.listen('tab.activated', onTabActivated);
            App.state.listen('tab.deactivated', onTabDeactivated);
            App.state.listen('message.added', onMessageAdded);

            return {
                dispose: function () {
                    App.state.ignore('tab.activated', onTabActivated);
                    App.state.ignore('tab.deactivated', onTabDeactivated);
                    App.state.ignore('message.added', onMessageAdded);
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
         * The groupMessage.chatForm submodule
         */
        ui.groupMessage.chatForm = (function () {
            var $el = ui.$ui.find('.group-chat__form'),
                $chatText = $el.find('.group-chat__form__text'),
                $chatSubmit = $el.find('.group-chat__form__submit');

            function toggleChat(enable, hide) {
                if (enable) {
                    $chatText.removeAttr('disabled');
                    $chatSubmit.removeAttr('disabled');
                } else {
                    $chatText.attr('disabled', 'disabled');
                    $chatSubmit.attr('disabled', 'disabled');
                }
                $el.toggleClass('group-chat__form--disabled', !!hide);
            }

            function onChat(e) {
                e.preventDefault();
                var chatMessage = $chatText.val().trim();
                if (!chatMessage.length) {
                    return;
                }
                toggleChat(false);
                App.state.sendMessage(chatMessage);
            }

            function onMessageSent() {
                $chatText.val('');
                toggleChat(true);
            }

            function onMessageFailed() {
                toggleChat(true);
                // TODO: show error
            }

            function onTabActivated() {
                var hide = !App.state.hasActiveTab(),
                    enable = !hide;
                toggleChat(enable, hide);
            }

            $el.on('click.chatForm', '.group-chat__form__submit', onChat);

            App.state.listen('message.sent', onMessageSent);
            App.state.listen('message.failed', onMessageFailed);
            App.state.listen('tab.activated', onTabActivated);
            App.state.listen('tab.deactivated', onTabActivated);

            return {
                dispose: function () {
                    App.state.ignore('message.sent', onMessageSent);
                    App.state.ignore('message.failed', onMessageFailed);
                    App.state.ignore('tab.activated', onTabActivated);
                    App.state.ignore('tab.deactivated', onTabActivated);
                    $el.off('.chatForm');
                    $chatText = null;
                    $chatSubmit = null;
                    $el = null;
                }
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
            ['menu', 'tabs', 'messages', 'buddies', 'chatForm'].forEach(function (module) {
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
        App.state.loadBuddies();
    }

    App.state.listen('init.success', onInitSuccess);
    App.state.listen('auth.success', onAuthSuccess);

}(App, jQuery, Handlebars, moment));