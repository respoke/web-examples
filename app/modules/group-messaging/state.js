(function groupMessagingState (App, respoke) {
    'use strict';

    var state = respoke.EventEmitter({});

    state.client = null;

    state.buddies = [
        {username: 'Everyone', isActive: false}
    ];

    function findBuddy(predicate) {
        var username = predicate;
        if (!$.isFunction (predicate)) {
            predicate = function (buddy) {
                return buddy.username === username;
            };
        }
        return state.buddies.filter(predicate)[0];
    }

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

    function removeBuddy(username) {
        var buddy = findBuddy(username);
        if (!buddy) {
            return;
        }
        state.buddies.splice(state.buddies.indexOf(buddy), 1);
        return buddy;
    }

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

    function onGroupJoin(e) {
        var username = e.connection.endpointId;
        var presence = e.connection.presence;
        if (addBuddy(username, presence, false)) {
            state.fire('buddies.updated');
        }
    }

    function onGroupLeave(e) {
        var username = e.connection.endpointId;
        if (removeBuddy(username)) {
            state.fire('buddies.updated');
        }
    }

    state.tabs = [];

    function findTab(predicate) {
        var label = predicate;
        if (!$.isFunction (predicate)) {
            predicate = function (tab) {
                return tab.label === label;
            };
        }
        return state.tabs.filter(predicate)[0];
    }

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

    var activateTab = state.activateTab = function activateTab(label) {
        state.tabs.forEach(function (tab) {
            tab.isActive = (tab.label === label);
        });
        state.fire('tab.activated', {
            label: label
        });
    };

    state.messages = [
        {to: 'Bob', from: 'John', content: 'test123', timestamp: Date.now()}
    ];

//    function sortByTimestamp(a, b) {
//        if (a.timestamp === b.timestamp) {
//            return 0;
//        }
//        if (a.timestamp > b.timestamp) {
//            return 1;
//        }
//        return -1;
//    }
//
//    state.messagesForEndpoint = function (endpointId) {
//        var activeUser = state.client.endpointId;
//        return state.messages.filter(function (message) {
//            return (message.to === activeUser || message.from === activeUser) &&
//                (message.to === endpointId || message.from === endpointId);
//        }).sort(sortByTimestamp);
//    };



    state.init = function (endpointId) {
        if (state.client && state.client.isConnected()) {
            return;
        }
        var connectionOptions = {
            appId: '7c15ec35-71a9-457f-8b73-97caf4eb43ca',
            developmentMode: true
        };
        state.client = respoke.createClient(connectionOptions);
        state.client.connect({
            endpointId: endpointId
        }).done(function () {
            state.fire('init.connected');
            return state.client.join({id: 'Everyone'}).then(function (group) {
                state.fire('init.group-joined');
                addBuddy('Everyone', 'available', false);
                state.everyoneGroup = group;
                state.everyoneGroup.listen('join', onGroupJoin);
                state.everyoneGroup.listen('leave', onGroupLeave);
                return state.everyoneGroup.getMembers().then(function (connections) {
                    connections.forEach(function (connection) {
                        addBuddy(connection.endpointId, connection.presence, false);
                    });
                    state.fire('buddies.updated');
                });
            });

        }, function (err) {
            console.error(err);
        });
    };

    App.state = (App.state || state);

}(App, respoke));