/*global sinon*/
describe('App.state module', function () {
    'use strict';
    var APP_ID = '9735D7C1-46AB-4598-954D-0B92889A6B83';
    var state;
    var respoke;

    beforeEach(function (done) {
        state = window.App.state;
        respoke = window.respoke;
        done();
    });

    describe('initial state', function () {
        it('should have a null client', function (done) {
            expect(state.client).to.be.null;
            done();
        });

        it('should have a null everyone group', function (done) {
            expect(state.everyoneGroup).to.be.null;
            done();
        });

        it('should have an empty logged in user', function (done) {
            expect(state.loggedInUser).to.be.empty;
            done();
        });

        it('should have no buddies', function (done) {
            expect(state.buddies).to.be.empty;
            done();
        });

        it('should have no tabs', function (done) {
            expect(state.tabs).to.be.empty;
            done();
        });

        it('should have no messages', function (done) {
            expect(state.messages).to.be.empty;
            done();
        });
    });

    describe('initializing the module', function () {
        describe('when a client already exists', function () {
            beforeEach(function (done) {
                state.client = respoke.createClient({});
                done();
            });

            it('should not attempt to reconnect if the client is connected', function (done) {
                state.client.isConnected = sinon.spy(function () {
                    return true;
                });
                state.init(APP_ID);
                expect(state.client.isConnected).to.have.been.called;
                expect(state.fire).to.not.have.been.called;
                done();
            });

            it('should attempt to reconnect if the client is not connected', function (done) {
                var oldClient = state.client;
                state.client.isConnected = sinon.spy(function () {
                    return false;
                });
                state.init(APP_ID);
                expect(oldClient.isConnected).to.have.been.called;
                expect(state.client).to.not.equal(oldClient);
                expect(state.fire).to.have.been.calledWith('init.success');
                done();
            });
        });

        describe('when no client already exists', function () {
            it('should attempt to connect', function (done) {
                state.init(APP_ID);
                expect(state.fire).to.have.been.calledWith('init.success');
                done();
            });
        });
    });

    describe('logging in', function () {
        var client;

        beforeEach(function (done) {
            state.fire = sinon.spy();
            client = state.client = respoke.EventEmitter({
                _resolveJoin: true,
                _error: {},
                connect: sinon.spy(function () {
                    return {
                        done: sinon.spy(function (onSuccess, onError) {
                            if (client._resolveJoin) {
                                return onSuccess();
                            }
                            onError(client._error);
                        })
                    };
                })
            });
            done();
        });

        describe('when the login succeeds', function () {
            beforeEach(function (done) {
                client._resolveJoin = true;
                done();
            });

            it('the logged in user should be set', function (done) {
                var expected = 'kirk';
                state.login(expected);
                expect(state.loggedInUser).to.equal(expected);
                done();
            });

            it('the client should listen to receive messages', function (done) {
                state.login('kirk');
                expect(state.client.listen).to.have.been.calledWith('message');
                done();
            });

            it('should fire a success event', function (done) {
                state.login('kirk');
                expect(state.fire).to.have.been.calledWith('login.success');
                done();
            });
        });

        describe('when the login fails', function () {
            beforeEach(function (done) {
                client._resolveJoin = false;
                client._error = {};
                done();
            });

            it('should fire an error event', function (done) {
                state.login('spock');
                expect(state.fire).to.have.been.calledWith('login.error', client._error);
                done();
            });
        });
    });

    describe('loading buddies', function () {
        var group, client;

        beforeEach(function (done) {
            state.everyoneGroup = null;
            state.buddies = [];
            state.fire = sinon.spy();
            client = state.client = respoke.ClientFactory();
            done();
        });

        describe('when the client joins the everyone group', function () {
            beforeEach(function (done) {
                state.fire = sinon.spy();
                state.everyoneGroup = null;
                client._resolveJoin = true;
                client._joinGroup = respoke.GroupFactory();
                client._joinGroup.getMembers = sinon.spy(function () {
                    return {
                        then: sinon.spy(function () {
                            return {then: sinon.spy()};
                        })
                    };
                });
                done();
            });

            it('should fire a group joined event', function (done) {
                state.loadBuddies();
                expect(state.fire).to.have.been.calledWith('group.joined');
                done();
            });

            it('should add the everyone group to the buddies list', function (done) {
                state.loadBuddies();
                expect(state.buddies).to.have.length(1);
                done();
            });

            it('should set the everyone group property', function (done) {
                state.loadBuddies();
                expect(state.everyoneGroup).to.deep.equal(client._joinGroup);
                done();
            });
        });

        describe('when the client fails to join the everyone group', function () {
            beforeEach(function (done) {
                client._resolveJoin = false;
                client._error = new Error();
                done();
            });

            it('should fire an error event', function (done) {
                state.loadBuddies();
                expect(state.fire).to.have.been.calledWith('group.unjoined', client._error);
                done();
            });
        });

        describe('when buddies are successfully loaded', function () {
            var connections;

            beforeEach(function (done) {
                connections = [0, 1, 2].map(function () {
                    return respoke.ConnectionFactory();
                });
                client._resolveJoin = true;
                client._joinGroup = respoke.GroupFactory(null, connections);
                done();
            });

            it('should add group members to the buddy collection', function (done) {
                state.loadBuddies();
                expect(state.buddies).to.have.length(4);
                done();
            });

            it('should fire a buddies.updated event', function (done) {
                state.loadBuddies();
                expect(state.fire).to.have.been.calledWith('buddies.updated');
                done();
            });
        });

        describe('when buddies fail to load', function () {
            var group;

            beforeEach(function (done) {
                client._resolveJoin = true;
                group = client._joinGroup;
                group._resolveJoin = false;
                group._error = new Error();
                done();
            });

            it('should fire a buddies.error event', function (done) {
                state.loadBuddies();
                expect(state.fire).to.have.been.calledWith('buddies.error', group._error);
                done();
            });
        });
    });

    describe('logging out', function () {
        var buddies;

        beforeEach(function (done) {
            state.fire = sinon.spy();
            state.client = respoke.ClientFactory();
            buddies = [0, 1, 2].map(function () {
                return {dispose: sinon.spy()};
            });
            state.buddies = buddies;
            state.tabs = [0, 1, 2];
            state.messages = {
                a: [0, 1, 2],
                b: [0, 1],
                c: [0]
            };
            state.everyoneGroup = respoke.GroupFactory();
            state.loggedInUser = 'kahn';
            done();
        });

        describe('when the client cannot disconnect', function () {
            beforeEach(function (done) {
                state.client._resolveDisconnect = false;
                done();
            });

            it('it will fire a logout.failed event', function (done) {
                state.logout();
                expect(state.fire).to.have.been.calledWith('logout.failed', state.client._disconnectError);
                done();
            });
        });

        describe('when the client can disconnect', function () {
            var everyoneGroup;

            beforeEach(function (done) {
                state.client._resolveDisconnect = true;
                everyoneGroup = state.everyoneGroup;
                done();
            });

            it('will ignore all further message events', function (done) {
                state.logout();
                expect(state.client.ignore).to.have.been.calledWith('message');
                done();
            });

            it('will dispose of all buddies', function (done) {
                state.logout();
                buddies.forEach(function (buddy) {
                    expect(buddy.dispose).to.have.been.called;
                });
                done();
            });

            it('will clear the buddies collection', function (done) {
                state.logout();
                expect(state.buddies).to.be.empty;
                done();
            });

            it('will fire a buddies.updated event', function (done) {
                state.logout();
                expect(state.fire).to.have.been.calledWith('buddies.updated');
                done();
            });

            it('will clear the tabs collection', function (done) {
                state.logout();
                expect(state.tabs).to.be.empty;
                done();
            });

            it('will clear the messages hash', function (done) {
                state.logout();
                expect(state.messages).to.be.empty;
                done();
            });

            it('will fire a messages.updated event', function (done) {
                state.logout();
                expect(state.fire).to.have.been.calledWith('messages.updated');
                done();
            });

            it('will unsubscribe the everyone group from the join event', function (done) {
                state.logout();
                expect(everyoneGroup.ignore).to.have.been.calledWith('join');
                done();
            });

            it('will unsubscribe the everyone group from the leave event', function (done) {
                state.logout();
                expect(everyoneGroup.ignore).to.have.been.calledWith('leave');
                done();
            });

            it('will throw away reference to everyone group', function (done) {
                state.logout();
                expect(state.everyoneGroup).to.be.null;
                done();
            });

            it('will set logged in user to empty string', function (done) {
                state.logout();
                expect(state.loggedInUser).to.be.empty;
                done();
            });

            it('will fire the logout.success event', function (done) {
                state.logout();
                expect(state.fire).to.have.been.calledWith('logout.success');
                done();
            });
        });
    });

    describe('sending a message', function () {
        var activeTab = {
            label: 'kahn',
            isActive: true
        };

        beforeEach(function (done) {
            state.loggedInUser = 'kirk';
            state.client = respoke.ClientFactory();
            state.fire = sinon.spy();
            state.buddies = [];
            state.tabs = [activeTab];
            state.messages = {};
            done();
        });

        describe('when the recipient is not in the buddies list', function () {
            it('will not send the message', function (done) {
                state.sendMessage('kahhhhhhhn!');
                expect(state.client.sendMessage).to.not.have.been.called;
                done();
            });
        });

        describe('when the recipient is in the buddies list', function () {
            var buddy;

            beforeEach(function (done) {
                buddy = {
                    _invokeCallbacks: false,
                    _resolveSend: true,
                    _sendError: new Error(),
                    username: 'kahn',
                    sendMessage: sinon.spy(function () {
                        return {
                            then: function (onSuccess, onError) {
                                if (!buddy._invokeCallbacks) {
                                    return;
                                }
                                if (buddy._resolveSend) {
                                    return onSuccess();
                                }
                                onError(buddy._sendError);
                            }
                        };
                    })
                };
                state.buddies.push(buddy);
                done();
            });

            it('should send the message', function (done) {
                var expected = 'kahhhhhhhn!';
                state.sendMessage(expected);
                expect(buddy.sendMessage).to.have.been.calledWith(expected);
                done();
            });

            describe('when the message is sent successfully', function () {
                beforeEach(function (done) {
                    buddy._invokeCallbacks = true;
                    buddy._resolveSend = true;
                    done();
                });

                it('should fire a message.sent event', function (done) {
                    state.sendMessage('kahhhhhhhn!');
                    expect(state.fire).to.have.been.calledWith('message.sent');
                    done();
                });

                it('should add a message to the message hash', function (done) {
                    state.sendMessage('kahhhhhhhn!');
                    expect(state.messages).to.have.property(buddy.username);
                    expect(state.messages[buddy.username]).to.have.length(1);
                    done();
                });
            });

            describe('when the message fails to send', function () {
                beforeEach(function (done) {
                    buddy._invokeCallbacks = true;
                    buddy._resolveSend = false;
                    done();
                });

                it('should fire a message.failed event', function (done) {
                    state.sendMessage('kahhhhhhhn!');
                    expect(state.fire).to.have.been.calledWith('message.failed');
                    done();
                });
            });
        });
    });

    describe('getting active messages', function () {
        beforeEach(function (done) {
            state.fire = sinon.spy();
            state.tabs = [];
            state.messages = {
                'kahn': [{}, {}, {}],
                'spock': [{}]
            };
            done();
        });

        describe('when there is no active tab', function () {
            it('will return an empty collection', function (done) {
                var messages = state.activeMessages();
                expect(messages).to.have.length(0);
                done();
            });
        });

        describe('when there is an active tab', function () {
            it('will return messages for that tab', function (done) {
                state.tabs.push({
                    label: 'kahn',
                    isActive: true
                });
                var messages = state.activeMessages();
                expect(messages).to.have.length(3);
                done();
            });
        });
    });

    describe('is there an active tab?', function () {
        it('returns false when there is no tab', function (done) {
            state.tabs = [];
            var actual = state.hasActiveTab();
            expect(actual).to.equal(false);
            done();
        });

        it('returns false when there is not an active tab', function (done) {
            state.tabs = [{isActive: false}, {isActive: false}];
            var actual = state.hasActiveTab();
            expect(actual).to.equal(false);
            done();
        });

        it('returns true when there is an active tab', function (done) {
            state.tabs = [{isActive: false}, {isActive: true}];
            var actual = state.hasActiveTab();
            expect(actual).to.equal(true);
            done();
        });
    });

    describe('activating a tab', function () {
        it('ignores all tags that do not match the label', function (done) {
            state.tabs = [
                {label: 'kirk', isActive: false},
                {label: 'kahn', isActive: false}
            ];
            state.activateTab('spock');
            state.tabs.forEach(function (tag) {
                expect(tag.isActive).to.be.false;
            });
            done();
        });

        it('activates a tab that matches the label', function (done) {
            state.tabs = [
                {label: 'kirk', isActive: false},
                {label: 'kahn', isActive: false},
                {label: 'spock', isActive: false}
            ];
            state.activateTab('spock');
            state.tabs.forEach(function (tab) {
                expect(tab.isActive).to.equal(tab.label === 'spock');
            });
            done();
        });

        it('fires a tag.activated event if any tag is active', function (done) {
            state.fire = sinon.spy();
            state.tabs = [
                {label: 'kirk', isActive: false},
                {label: 'kahn', isActive: false},
                {label: 'spock', isActive: false}
            ];
            state.activateTab('spock');
            expect(state.fire).to.have.been.calledWith('tab.activated', {label: 'spock'});
            done();
        });

        it('fires a tabs.updated event', function (done) {
            state.fire = sinon.spy();
            state.tabs = [];
            state.activateTab('');
            expect(state.fire).to.have.been.calledWith('tabs.updated');
            done();
        });
    });

    describe('closing a tab', function () {
        beforeEach(function (done) {
            state.fire = sinon.spy();
            state.tabs = [];
            done();
        });

        it('does not close a tab if none match the label', function (done) {
            state.tabs = [
                {label: 'kirk', isActive: true}
            ];
            state.closeTab('kahn');
            expect(state.tabs).to.have.length(1);
            expect(state.fire).to.not.have.been.calledWith('tab.closed');
            done();
        });

        it('will remove the tab from the collection if it matches the label', function (done) {
            state.tabs = [
                {label: 'kirk', isActive: true},
                {label: 'kahn', isActive: false}
            ];
            state.closeTab('kahn');
            expect(state.tabs).to.have.length(1);
            done();
        });

        it('will fire the tab.deactivated event if the tab to be closed is active', function (done) {
            state.tabs = [
                {label: 'kirk', isActive: false},
                {label: 'kahn', isActive: true}
            ];
            state.closeTab('kahn');
            expect(state.fire).to.have.been.calledWith('tab.deactivated', {label: 'kahn'});
            done();
        });

        it('will fire the tab.closed event', function (done) {
            state.tabs = [
                {label: 'kirk', isActive: false},
                {label: 'kahn', isActive: true}
            ];
            state.closeTab('kahn');
            expect(state.fire).to.have.been.calledWith('tab.closed', {label: 'kahn'});
            done();
        });
    });

    describe('activating a buddy', function () {
        beforeEach(function (done) {
            state.buddies = [];
            state.fire = sinon.spy();
            done();
        });

        it('will not activate a buddy if there are no buddies in the collection', function (done) {
            state.activateBuddy('kahn');
            expect(state.fire).to.not.have.been.calledWith('buddy.activated');
            done();
        });

        it('will not activate a buddy if there are no buddies with the specified username', function (done) {
            state.buddies = [
                {username: 'kirk', isActive: false}
            ];
            state.activateBuddy('kahn');
            expect(state.fire).to.not.have.been.calledWith('buddy.activated');
            done();
        });

        it('will fire the buddy.activated event if the buddy has been activated', function (done) {
            state.buddies = [
                {username: 'kirk', isActive: false},
                {username: 'kahn', isActive: false}
            ];
            state.activateBuddy('kahn');
            expect(state.fire).to.have.been.calledWith('buddy.activated', {username: 'kahn'});
            done();
        });

        it('should fire a tab.opened event for the user', function (done) {
            state.buddies = [
                {username: 'kirk', isActive: false},
                {username: 'kahn', isActive: false}
            ];
            state.activateBuddy('kahn');
            expect(state.fire).to.have.been.calledWith('tab.opened', {label: 'kahn', isActive: true});
            done();
        });
    });

    describe('receiving a message', function () {
        var client;

        beforeEach(function (done) {
            client = state.client = respoke.ClientFactory();
            state.loggedInUser = '';
            state.messages = {};
            done();
        });

        it('should add a user message to that users message collection', function (done) {
            var userMessage = {
                endpointId: 'kahn',
                message: 'You are in a position to demand nothing!',
                timestamp: Date.now()
            };
            state.login('kirk'); // sets up the client listener
            client.fire('message', {message: userMessage});
            expect(state.messages).to.have.property('kahn');
            expect(state.messages.kahn).to.have.length(1);
            done();
        });

        it('should add a group message to the group collection', function (done) {
            var userMessage = {
                endpointId: 'kahn',
                message: 'You are in a position to demand nothing!',
                timestamp: Date.now(),
                recipient: 'Everyone'
            };
            state.login('kirk'); // sets up the client listener
            client.fire('message', {message: userMessage});
            expect(state.messages).to.have.property('Everyone');
            expect(state.messages).to.not.have.property('kahn');
            expect(state.messages.Everyone).to.have.length(1);
            done();
        });
    });

    describe('group member joins', function () {
        var client;

        beforeEach(function (done) {
            client = state.client = respoke.ClientFactory();
            state.loggedInUser = '';
            state.buddies = [];
            state.fire = sinon.spy();
            done();
        });

        describe('when the joining member is the logged in user', function () {
            it('will not add member to the buddies list', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.everyoneGroup.fire('join', {
                    connection: respoke.ConnectionFactory('kirk')
                });
                expect(state.buddies).to.have.length(1); // includes everyone group buddy
                done();
            });

            it('will not fire the buddies.updated event', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.fire = sinon.spy();
                state.everyoneGroup.fire('join', {
                    connection: respoke.ConnectionFactory('kirk')
                });
                expect(state.fire).to.not.have.been.calledWith('buddies.updated');
                done();
            });
        });

        describe('when the joining member is already on the buddies list', function () {
            it('does not attempt to add the buddy to the list', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.buddies.push({
                    username: 'kahn'
                });
                state.everyoneGroup.fire('join', {
                    connection: respoke.ConnectionFactory('kahn')
                });
                expect(state.buddies).to.have.length(2); // includes everyone group buddy
                done();
            });

            it('will not fire the buddies.updated event', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.buddies.push({
                    username: 'kahn'
                });
                state.fire = sinon.spy();
                state.everyoneGroup.fire('join', {
                    connection: respoke.ConnectionFactory('kahn')
                });
                expect(state.fire).to.not.have.been.calledWith('buddies.updated');
                done();
            });
        });

        describe('when the joining member is not the logged in user', function () {
            it('adds member to the buddies list if the member is not already there', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.everyoneGroup.fire('join', {
                    connection: respoke.ConnectionFactory('kahn')
                });
                expect(state.buddies).to.have.length(2); // includes everyone group buddy
                done();
            });

            it('fires the buddies.updated event if the member was added to the list', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.fire = sinon.spy();
                state.everyoneGroup.fire('join', {
                    connection: respoke.ConnectionFactory('kahn')
                });
                expect(state.fire).to.have.been.calledWith('buddies.updated');
                done();
            });
        });


    });

    describe('group member leaves', function () {
        var client;

        beforeEach(function (done) {
            client = state.client = respoke.ClientFactory();
            state.loggedInUser = '';
            state.buddies = [];
            state.fire = sinon.spy();
            done();
        });

        describe('when the buddy is not in the buddies list', function () {
            it('will not remove any buddies from the list', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                var buddy = respoke.EventEmitterFactory({username: 'spock', dispose: sinon.spy()});
                state.buddies.push(buddy);
                state.everyoneGroup.fire('leave', {
                    connection: respoke.ConnectionFactory('kahn')
                });
                expect(state.buddies).to.have.length(2); // includes "Everyone" group
                done();
            });

            it('will not fire the buddies.updated event', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.fire = sinon.spy();
                state.everyoneGroup.fire('leave', {
                    connection: respoke.ConnectionFactory('kahn')
                });
                expect(state.fire).to.not.have.been.calledWith('buddies.updated');
                done();
            });
        });

        describe('when the buddy is in the buddies list', function () {
            it('will remove the buddy from the buddies list', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                var buddy = respoke.EventEmitterFactory({username: 'spock', dispose: sinon.spy()});
                state.buddies.push(buddy);
                state.everyoneGroup.fire('leave', {
                    connection: respoke.ConnectionFactory('spock')
                });
                expect(state.buddies).to.have.length(1); // includes "Everyone" group
                done();
            });

            it('will unsubscribe the buddy from presence change events', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                var buddy = respoke.EventEmitterFactory({username: 'spock', dispose: sinon.spy()});
                state.buddies.push(buddy);
                state.everyoneGroup.fire('leave', {
                    connection: respoke.ConnectionFactory('spock')
                });
                expect(buddy.ignore).to.have.been.calledWith('presence.changed');
                done();
            });

            it('will dispose the buddy object', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                var buddy = respoke.EventEmitterFactory({username: 'spock', dispose: sinon.spy()});
                state.buddies.push(buddy);
                state.everyoneGroup.fire('leave', {
                    connection: respoke.ConnectionFactory('spock')
                });
                expect(buddy.dispose).to.have.been.called;
                done();
            });

            it('will fire the buddies.updated event', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                var buddy = respoke.EventEmitterFactory({username: 'spock', dispose: sinon.spy()});
                state.buddies.push(buddy);
                state.fire = sinon.spy();
                state.everyoneGroup.fire('leave', {
                    connection: respoke.ConnectionFactory('spock')
                });
                expect(state.fire).to.have.been.calledWith('buddies.updated');
                done();
            });

            it('will close the chat tab for the buddy if it is active', function (done) {
                state.login('kirk');
                state.loadBuddies(); // joins the "Everyone" group and listens for group events
                state.tabs = [
                    {label: 'spock', isActive: true}
                ];
                var buddy = respoke.EventEmitterFactory({username: 'spock', dispose: sinon.spy()});
                state.buddies.push(buddy);
                state.fire = sinon.spy();
                state.everyoneGroup.fire('leave', {
                    connection: respoke.ConnectionFactory('spock')
                });
                expect(state.tabs).to.have.length(0);
                expect(state.fire).to.have.been.calledWith('tab.closed', {label: 'spock'});
                done();
            });
        });
    });
});