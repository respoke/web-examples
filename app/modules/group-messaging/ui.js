/*global Handlebars, moment*/
(function groupMessagingUI (App, $, Handlebars, moment) {
    'use strict';

    /**
     * Handlebars helper that takes a "presence" string and
     * converts it to a specific HTML class for styling
     * purposes
     */
    Handlebars.registerHelper('presenceClass', function presenceClassHelper(options) {
        var presence = options.fn(this);
        return $.helpers.getPresenceClass(presence);
    });

    /**
     * Handlebars helper that takes a username (endpointId)
     * and converts it to a gravatar URL
     */
    Handlebars.registerHelper('gravatar', function gravatarHelper(options) {
        var username = options.fn(this);
        return $.helpers.getAvatar(username);
    });

    /**
     * Handlebars helper that takes a numeric timestamp
     * and converts it to a friendly date string
     */
    Handlebars.registerHelper('friendlyTime', function friendlyTimeHelper(options) {
        var timestamp = Number(options.fn(this));
        var now = moment(timestamp);
        return now.format('MM/DD/YYYY');
    });

    Handlebars.registerHelper('elid', function elementID(options) {
        var unsanitized = options.fn(this);
        return $.helpers.sanitizeElementID(unsanitized);
    });

    /**
     * Compiled Handlebars templates
     * @type {{authForm:Function, groupMessage:Function, chatTabs:Function, buddies:Function, chatMessages:Function}}
     */
    var TEMPLATE = {
        authForm: Handlebars.compile($('#auth-form-template').text()),
        groupMessage: Handlebars.compile($('#group-message-template').text()),
        chatTabs: Handlebars.compile($('#chat-tabs-template').text()),
        buddies: Handlebars.compile($('#buddies-template').text()),
        chatMessages: Handlebars.compile($('#chat-messages-template').text())
    };

    /**
     * The App.ui module
     * @type {Object}
     */
    var ui = App.ui = {};

    /**
     * The root UI element
     * @type {HTMLElement}
     */
    ui.$root = $('#ui');

    /**
     * The authentication module
     */
    ui.auth = function () {
        ui.$root.empty();
        ui.$root.append(TEMPLATE.authForm({}));

        /**
         * The auth.authForm submodule
         */
        ui.auth.authForm = (function () {
            /**
             * Root auth form element
             * @type {jQuery}
             */
            var $el = ui.$root.find('.authentication'),
                /**
                 * Username text element
                 * @type {jQuery}
                 */
                $username = $el.find('.cbl-name__text');

            /**
             * Handles the submit event of the auth form
             * @param {jQuery.Event} e
             */
            function onAuthFormSubmit(e) {
                e.preventDefault();
                var username = $username.val();
                App.state.login(username);
            }

            $el.on('submit.authForm', onAuthFormSubmit);

            return {
                /**
                 * Disposes of the auth.authForm submodule
                 */
                dispose: function () {
                    $el.off('.authForm');
                    $el = null;
                    $username = null;


                    // hide the the description text
                    var desc = $('.app-description');
                    desc.css('display','none');
                    desc = null;
                }
            };
        }());

        /**
         * Disposes of the auth module and all of its submodules
         */
        ui.auth.dispose = function () {
            ui.auth.authForm.dispose();
            ui.auth.authForm = null;
            ui.$root.empty();
        };
    };

    /**
     * The group message module
     */
    ui.groupMessage = function () {
        ui.$root.empty();
        ui.$root.append(TEMPLATE.groupMessage({
            username: App.state.loggedInUser
        }));

        /**
         * The groupMessage.menu submodule
         */
        ui.groupMessage.menu = (function () {
            var $openButton = $('.group-list-open'),
                $closeButton = $('.group-list-close');

            /**
             * Checks the status of the group list and opens/closes
             * the menu in respose
             */
            function checkStatus () {
                if ($('.group-list').length) {
                    openMenu();
                } else {
                    closeMenu();
                }
            }

            /**
             * Hides the menu
             * @param {jQuery.Event} e
             */
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

            /**
             * Opens the menu
             */
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

            /**
             * Closes the menu
             */
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
            ui.$root.on('click.menu touchstart.menu', hideMenu);

            return {
                /**
                 * Disposes of the groupMessage.menu submodule
                 */
                dispose: function () {
                    $openButton.off('.menu');
                    $closeButton.off('.menu');
                    ui.$root.off('.menu');
                    $openButton = $closeButton = null;
                }
            };
        }());

        /**
         * The groupMessage.tabs submodule
         */
        ui.groupMessage.tabs = (function () {
            /**
             * Root header tabs element
             * @type {jQuery}
             */
            var $el = $('.group-chat__header__tabs');

            /**
             * Renders tabs
             */
            function render() {
                var html = TEMPLATE.chatTabs({
                    tabs: App.state.tabs
                });
                $el.empty();
                $el.append(html);
            }

            /**
             * Handles the message.received event from App.state
             * @param {{key:String}} e - event
             */
            function onMessageReceived(e) {
                var times = 3;
                function twinkle() {
                    if (times === 0) {
                        return;
                    }
                    var id = $.helpers.sanitizeElementID(e.key);
                    $el.find('#' + id)
                        .fadeTo('fast', 0.5)
                        .fadeTo('fast', 1.0);
                    times -= 1;
                    setTimeout(twinkle, 0);
                }
                twinkle();
            }

            /**
             * Handles the click event for a tab
             * @param {jQuery.Event} e
             */
            function onTabClicked(e) {
                var label = e.target.getAttribute('id');
                label = $.helpers.unsanitizeElementID(label);
                App.state.activateTab(label);
            }

            /**
             * Handles the click event for a tab's close button
             * @param {jQuery.Event} e
             */
            function onCloseClicked(e) {
                var label = $(e.target).parent().attr('id');
                label = $.helpers.unsanitizeElementID(label);
                App.state.closeTab(label);
            }

            $el.on('click.tabs', '.tab', onTabClicked);
            $el.on('click.tabs', '.close', onCloseClicked);

            App.state.listen('tab.opened', render);
            App.state.listen('tab.closed', render);
            App.state.listen('tab.activated', render);
            App.state.listen('message.received', onMessageReceived);

            return {
                /**
                 * Disposes of the groupMessage.tabs submodule
                 */
                dispose: function () {
                    $el.off('.tabs');
                    App.state.ignore('tab.opened', render);
                    App.state.ignore('tab.closed', render);
                    App.state.ignore('tab.activated', render);
                    App.state.ignore('message.received', onMessageReceived);
                }
            };
        }());

        /**
         * The groupMessage.messages submodule
         */
        ui.groupMessage.messages = (function () {
            /**
             * Root group chat element
             * @type {jQuery}
             */
            var $el = $('.group-chat');

            /**
             * Renders messages
             */
            function render() {
                var html = TEMPLATE.chatMessages({
                    messages: App.state.activeMessages()
                });
                $el.empty();
                $el.append(html);
            }

            /**
             * Handles the tab.activated event from App.state
             */
            function onTabActivated() {
                render();
            }

            /**
             * Handles the tab.deactivated event from App.state
             */
            function onTabDeactivated() {
                render();
            }

            /**
             * Handles the message.added event from App.state
             */
            function onMessageAdded() {
                render();
            }

            App.state.listen('tab.activated', onTabActivated);
            App.state.listen('tab.deactivated', onTabDeactivated);
            App.state.listen('message.added', onMessageAdded);

            return {
                /**
                 * Disposes of the groupMessage.messages submodule
                 */
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
            /**
             * Root buddy list element
             * @type {jQuery}
             */
            var $el = $('.buddy-list--mini');

            /**
             * Renders buddies
             */
            function render() {
                var html = TEMPLATE.buddies({
                    buddies: App.state.buddies
                });
                $el.empty();
                $el.append(html);
            }

            /**
             * Handles the click event for buddies
             * @param {jQuery.Event} e
             */
            function onUserClicked(e) {
                var username = e.currentTarget.getAttribute('id');
                username = $.helpers.unsanitizeElementID(username);
                App.state.activateBuddy(username);
            }

            $el.on('click.buddies', '.buddy-list--mini__user', onUserClicked);

            App.state.listen('buddies.updated', render);
            App.state.listen('buddy.activated', render);

            return {
                /**
                 * Disposes of the groupMessage.buddies submodule
                 */
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
            /**
             * Root chat form element
             * @type {jQuery}
             */
            var $el = ui.$root.find('.group-chat__form'),
                /**
                 * Chat text input element
                 * @type {jQuery}
                 */
                $chatText = $el.find('.group-chat__form__text'),
                /**
                 * Chat submit button element
                 * @type {jQuery}
                 */
                $chatSubmit = $el.find('.group-chat__form__submit');

            /**
             * Toggles the accessibility/visibility of the chat form
             * @param {Boolean} enableControls
             * @param {Boolean} [hideForm]
             */
            function toggleChat(enableControls, hideForm) {
                if (enableControls) {
                    $chatText.removeAttr('disabled');
                    $chatSubmit.removeAttr('disabled');
                } else {
                    $chatText.attr('disabled', 'disabled');
                    $chatSubmit.attr('disabled', 'disabled');
                }
                $el.toggleClass('group-chat__form--disabled', !!hideForm);
            }

            /**
             * Handles the submitted event of the chat form
             * @param {jQuery.Event} e
             */
            function onChatSubmitted(e) {
                e.preventDefault();
                var chatMessage = $chatText.val().trim();
                if (!chatMessage.length) {
                    return;
                }
                toggleChat(false);
                App.state.sendMessage(chatMessage);
            }

            /**
             * Handles the message.sent event from App.state
             */
            function onMessageSent() {
                $chatText.val('');
                toggleChat(true);
            }

            /**
             * Handles the message.failed event form App.state
             */
            function onMessageFailed() {
                toggleChat(true);
            }

            /**
             * Handles the tab.activated and tab.deactivated events from App.state
             */
            function onTabActivationChanged() {
                var hide = !App.state.hasActiveTab(),
                    enable = !hide;
                toggleChat(enable, hide);
            }

            $el.on('click.chatForm', '.group-chat__form__submit', onChatSubmitted);

            App.state.listen('message.sent', onMessageSent);
            App.state.listen('message.failed', onMessageFailed);
            App.state.listen('tab.activated', onTabActivationChanged);
            App.state.listen('tab.deactivated', onTabActivationChanged);

            return {
                /**
                 * Disposes of the groupMessage.chatForm submodule
                 */
                dispose: function () {
                    App.state.ignore('message.sent', onMessageSent);
                    App.state.ignore('message.failed', onMessageFailed);
                    App.state.ignore('tab.activated', onTabActivationChanged);
                    App.state.ignore('tab.deactivated', onTabActivationChanged);
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

        ui.$root.on('click.groupMessage', '.logout', onLogOut);

        /**
         * Disposes the groupMessage module and all of its submodules
         */
        ui.groupMessage.dispose = function() {
            ['menu', 'tabs', 'messages', 'buddies', 'chatForm'].forEach(function (module) {
                ui.groupMessage[module].dispose();
                ui.groupMessage[module] = null;
            });
            ui.$root.off('.groupMessage');
            ui.$root.empty();
        };
    };

    /**
     * Handles the init.success event
     */
    function onInitSuccess() {
        ui.auth();
    }

    /**
     * Handles the login.success event of App.state
     */
    function onLoginSuccess() {
        ui.auth.dispose();
        ui.groupMessage();
        App.state.loadBuddies();
    }

    /**
     * Handles the logout.success event of App.state
     */
    function onLogoutSuccess() {
        ui.groupMessage.dispose();
        ui.auth();
    }

    App.state.listen('init.success', onInitSuccess);
    App.state.listen('login.success', onLoginSuccess);
    App.state.listen('logout.success', onLogoutSuccess);

}(App, jQuery, Handlebars, moment));