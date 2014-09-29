(function groupMessagingState (App, respoke) {
    'use strict';

    /**
     * The state module
     * @type {respoke.EventEmitter}
     */
    var state = respoke.EventEmitter({});

    /**
     * The respoke lient
     * @type {respoke.Client}
     */
    state.client = null;

    /**
     * The current logged in user
     * @type {String}
     */
    state.loggedInUser = '';

    /**
     * @typedef {{username:String, presence:String, isActive:Boolean}} Buddy
     */

    /**
     * The user's current buddies/groups
     * @type {Array.<Buddy>}
     */
    state.buddies = [];

    /**
     * Finds a buddy by predicate (or ID)
     * @param {Function|String} predicate - function predicate or string ID
     * @returns {Array.<Buddy>}
     */
    function findBuddy(predicate) {
        var username = predicate;
        if (!$.isFunction (predicate)) {
            predicate = function (buddy) {
                return buddy.username === username;
            };
        }
        return state.buddies.filter(predicate)[0];
    }

    /**
     * Adds a buddy to the buddies collection
     * @param {String} username
     * @param {String} [presence]
     * @param {Boolean} [isActive]
     * @returns {Buddy}
     */
    function addBuddy(username, presence, isActive) {
        var buddy = findBuddy(username);
        if (!buddy) {
            buddy = {
                username: username,
                presence: presence || 'unavailable',
                isActive: !!isActive
            };
            state.buddies.push(buddy);
        }
        if (buddy.isActive) {
            activateBuddy(username);
        }
        return buddy;
    }

    /**
     * Removes a buddy from the buddies collection
     * @param {String} username
     * @returns {Buddy}
     */
    function removeBuddy(username) {
        var buddy = findBuddy(username);
        if (!buddy) {
            return;
        }
        state.buddies.splice(state.buddies.indexOf(buddy), 1);
        return buddy;
    }

    /**
     * Activates a buddy in the buddies collection
     * @param {String} username
     */
    var activateBuddy = state.activateBuddy = function activateBuddy(username) {
        state.buddies.forEach(function (buddy) {
            buddy.isActive = (buddy.username === username);
        });
        state.fire('buddy.activated', {
            username: username
        });
        openTab(username, true);
        state.fire('tab.opened', {
            label: username
        });
    };

    /**
     * @typedef {{connection: {endpointId:String, presence:String} }} GroupEvent
     */

    /**
     * Handles the group join event from respoke.Client
     * @param {GroupEvent} e - event
     */
    function onGroupJoin(e) {
        var username = e.connection.endpointId;
        var presence = e.connection.presence;
        if (addBuddy(username, presence, false)) {
            state.fire('buddies.updated');
        }
    }

    /**
     * Handles the group leave event from respoke.Client
     * @param {GroupEvent} e - event
     */
    function onGroupLeave(e) {
        var username = e.connection.endpointId;
        if (removeBuddy(username)) {
            state.fire('buddies.updated');
        }
    }

    /**
     * @typedef {{label:String, isActive:Boolean}} Tab
     */

    /**
     * Data for open chat tabs
     * @type {Array.<Tab>}
     */
    state.tabs = [];

    /**
     * Finds a specific tab by predicate or label
     * @param {Function|String} predicate - predicate function or label
     * @returns {Tab}
     */
    function findTab(predicate) {
        var label = predicate;
        if (!$.isFunction (predicate)) {
            predicate = function (tab) {
                return tab.label === label;
            };
        }
        return state.tabs.filter(predicate)[0];
    }

    /**
     * Opens a specific tab
     * @param {String} label
     * @param {Boolean} [isActive] - make this the active tab
     * @returns {Tab}
     */
    function openTab(label, isActive) {
        var tab = findTab(label);
        if (!tab) {
            tab = {
                label: label,
                isActive: !!isActive
            };
            state.tabs.push(tab);
        }
        if (isActive) {
            activateTab(label);
        }
        return tab;
    }

    /**
     * Closes a specific tab
     * @param {String} label
     */
    var closeTab = state.closeTab = function closeTab(label) {
        var tab = findTab(label);
        if (!tab) {
            return;
        }
        state.tabs.splice(state.tabs.indexOf(tab), 1);
        state.fire('tab.closed', {
            label: label
        });
    };

    /**
     * Activate a specific tab (or optionally deactivate all tabs if label is omitted)
     * @param {String} [label] - tab label
     */
    var activateTab = state.activateTab = function activateTab(label) {
        state.tabs.forEach(function (tab) {
            tab.isActive = (tab.label === label);
        });
        state.fire('tab.activated', {
            label: label
        });
    };

    /**
     * @typedef {{}} ChatMessage
     */

    /**
     * Chat message data
     * @type {Array.<ChatMessage>}
     */
    state.messages = [
        //{to: 'Bob', from: 'John', content: 'test123', timestamp: Date.now()}
    ];

    // initialization/load methods

    /**
     * Loads roster data
     * @returns {respoke.Promise}
     */
    state.loadRoster = function () {
        state.buddies = [];
        return state.client.join({id: 'Everyone'}).then(function (group) {
            state.fire('group.joined');
            addBuddy('Everyone', 'available', false);
            state.everyoneGroup = group;
            state.everyoneGroup.listen('join', onGroupJoin);
            state.everyoneGroup.listen('leave', onGroupLeave);
            return state.everyoneGroup.getMembers().then(function (connections) {
                connections.forEach(function (connection) {
                    addBuddy(connection.endpointId, connection.presence, false);
                });
            }).then(function () {
                state.fire('buddies.updated');
            }, function (err) {
                state.fire('roster.error', err);
                console.error(err);
            });
        });
    };

    /**
     * Logs the user in
     * @param {String} username
     * @returns {respoke.Promise}
     */
    state.login = function (username) {
        return state.client.connect({
            endpointId: username
        }).done(function (e) {
            console.info('>> login', e);
            state.loggedInUser = username;
            state.fire('auth.success');
        }, function (err) {
            state.fire('auth.error', err);
            console.error(err);
        });
    };

    /**
     * Logs the user out
     */
    state.logout = function () {
        //TODO: implement
    };

    /**
     * Initializes application state and creates a client
     * connection to respoke
     */
    state.init = function () {
        if (state.client && state.client.isConnected()) {
            return;
        }
        var connectionOptions = {
            appId: '7c15ec35-71a9-457f-8b73-97caf4eb43ca',
            developmentMode: true
        };
        state.client = respoke.createClient(connectionOptions);
        state.fire('init.success');
    };

    App.state = (App.state || state);

}(App, respoke));