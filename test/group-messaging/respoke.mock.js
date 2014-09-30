(function () {
    'use strict';
    var respoke = window.respoke = {
        // factories

        EventEmitterFactory: function (base) {
            base._handlers = {};
            base.fire = sinon.spy(function () {
                var event = arguments[0];
                var args = Array.prototype.slice.call(arguments, 1);
                if (!base._handlers.hasOwnProperty(event)) {
                    return;
                }
                var handlers = base._handlers[event];
                handlers.forEach(function (handler) {
                    handler.apply(null, args);
                });
            });
            base.listen = sinon.spy(function (event, cb) {
                if (!base._handlers.hasOwnProperty(event)) {
                    base._handlers[event] = [];
                }
                base._handlers[event].push(cb);
            });
            base.ignore = sinon.spy(function (event, cb) {
                if (!base._handlers.hasOwnProperty(event)) {
                    return;
                }
                var handlers = base._handlers[event];
                var index = handlers.indexOf(cb);
                if (index === -1) {
                    return;
                }
                handlers.splice(index, 1);
            });
            return base;
        },

        ClientFactory: function () {
            var client = respoke.EventEmitter({
                isConnected: sinon.spy(),
                sendMessage: sinon.spy(),
                // join
                _resolveJoin: true,
                _joinError: new Error(),
                _joinGroup: respoke.GroupFactory(),
                join: sinon.spy(function () {
                    return {
                        then: sinon.spy(function (onSuccess, onError) {
                            if (client._resolveJoin) {
                                return onSuccess(client._joinGroup);
                            }
                            onError(client._joinError);
                        })
                    };
                }),
                // connect
                _resolveConnect: true,
                _connectError: new Error(),
                connect: sinon.spy(function () {
                    return {
                        done: function (onSuccess, onError) {
                            if (client._resolveConnect) {
                                return onSuccess();
                            }
                            onError(client._connectError);
                        }
                    };
                }),
                // disconnect
                _resolveDisconnect: true,
                _disconnectError: new Error(),
                disconnect: function () {
                    return {
                        then: function (onSuccess, onError) {
                            if (client._resolveDisconnect) {
                                return onSuccess();
                            }
                            onError(client._disconnectError);
                        }
                    };
                }
            });
            return client;
        },

        GroupFactory: function (groupId, connections) {
            var now = Date.now();
            groupId = groupId || 'group-' + now;
            connections = connections || [];
            var group = respoke.EventEmitterFactory({
                _resolveJoin: true,
                _connections: connections,
                _error: {},
                id: groupId,
                getMembers: sinon.spy(function () {
                    return {
                        then: function (onSuccess) {
                            if (group._resolveJoin) {
                                onSuccess(connections);
                            }
                            return {
                                then: function (onSuccess, onError) {
                                    if (group._resolveJoin) {
                                        onSuccess();
                                    } else {
                                        onError(group._error);
                                    }
                                }
                            };
                        }
                    };
                }),
                sendMessage: sinon.spy()
            });

            return group;
        },

        ConnectionFactory: function (endpointId, presence) {
            var now = Date.now();
            endpointId = endpointId || 'endpoint-' + now.toString();
            presence = presence || 'available';
            return {
                endpointId: endpointId,
                presence: presence,
                getEndpoint: function () {
                    return respoke.EndpointFactory(endpointId, presence);
                }
            };
        },

        EndpointFactory: function (endpointId, presence) {
            var now = Date.now();
            endpointId = endpointId || 'endpoint-' + now.toString();
            presence = presence || 'available';
            return respoke.EventEmitterFactory({
                endpointId: endpointId,
                presence: presence
            });
        },

        // mocks

        EventEmitter: sinon.spy(function (base) {
            return respoke.EventEmitterFactory(base);
        }),

        createClient: sinon.spy(function (/*options*/) {
            return respoke.ClientFactory();
        })
    };
}());