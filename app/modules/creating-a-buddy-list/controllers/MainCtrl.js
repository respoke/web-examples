App.controllers.buddylistCtrl = (function ($, App) {

    'use strict';

    /**
     * The buddy list view
     */
    return function (options) {

        var client, endpoints = {};

        return {

            /**
             * Returns the client's endpoint
             */
            getClientEndpoint: function () {
                return endpoints[client.endpointId];
            },

            /**
             * Renders a single group member
             */
            renderGroupMember: function (key, endpoint) {
                
                var buddyCtrl = App.controllers.buddyCtrl(options);

                // Save a reference to the endpoint
                endpoints[endpoint.endpointId] = endpoint;

                // Initialize the buddy controller
                buddyCtrl.init(endpoint);

            },

            /**
             * Renders all of the current group members
             */
            renderGroup: function (members) {
                $.each(members, this.renderGroupMember);
            },

            /**
             * When a group member joins, we need to add them to the group list
             */
            onMemberJoin: function (e) {
                this.renderGroupMember(null, e.connection);
            },

            /**
             * When a group member leaves, we can remove them from the DOM
             */
            onMemberLeave: function (e) {
                var cls = $.helpers.getClassName(e.connection.endpointId);
                this.el.find('.buddy-list #user-' + cls).remove();
            },

            /**
             * Gets the members of a group and listens for additions and subtractions
             */
            getGroup: function (group) {
                group.listen('join', this.onMemberJoin.bind(this));
                group.listen('leave', this.onMemberLeave.bind(this));
                group.getMembers({
                    onSuccess: this.renderGroup.bind(this)
                });
            },

            /**
             * Join a group
             */
            joinGroup: function () {

                client.join({
                    id: 'everyone',
                    onSuccess: this.getGroup.bind(this)
                });

            },

            /**
             * Changes the status of the connected endpoint
             */
            changePresence: function (status) {

                this.getClientEndpoint().setPresence({
                    presence: status
                });

            },

            /**
             * A callback after the respoke client is connected
             */
            onConnection: function (connection) {

                var userObj = $.extend({
                    onPresenceChange: this.changePresence.bind(this)
                }, connection, options);

                client = connection;

                App.controllers.userPresenceCtrl(userObj).init();

                this.joinGroup();

            },

            /**
             * Initialize the buddy list view
             */
            init: function () {
                this.el = $(options.renderTo);
                options = $.extend(options, {
                    onConnection: this.onConnection.bind(this)
                });
                App.controllers.authenticationCtrl(options).init();
            }

        };

    };

}(jQuery, App));