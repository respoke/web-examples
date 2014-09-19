App.controllers.buddylistCtrl = (function ($, App) {

    'use strict';

    /**
     * The Main Buddy List Controller
     */
    return function (options) {

        var client, $el, endpoints = {};

        /**
         * Returns the client's endpoint
         */
        function getClientEndpoint () {
            return endpoints[client.endpointId];
        }

        /**
         * Renders a single group member
         */
        function renderGroupMember (key, endpoint) {
            
            var buddyCtrl = App.controllers.buddyCtrl(options, endpoint);

            // Save a reference to the endpoint
            endpoints[endpoint.endpointId] = endpoint;

        }

        /**
         * Renders all of the current group members
         */
        function renderGroup (members) {
            $.each(members, renderGroupMember);
        }

        /**
         * When a group member joins, we need to add them to the group list
         */
        function onMemberJoin (e) {
            renderGroupMember(null, e.connection);
        }

        /**
         * When a group member leaves, we can remove them from the DOM
         */
        function onMemberLeave (e) {
            var cls = $.helpers.getClassName(e.connection.endpointId);
            $el.find('.buddy-list #user-' + cls).remove();
        }

        /**
         * Gets the members of a group and listens for additions and subtractions
         */
        function getGroup (group) {
            group.listen('join', onMemberJoin);
            group.listen('leave', onMemberLeave);
            group.getMembers({
                onSuccess: renderGroup
            });
        }

        /**
         * Join a group
         */
        function joinGroup () {
            client.join({
                id: 'everyone',
                onSuccess: getGroup
            });
        }

        /**
         * Changes the status of the connected endpoint
         */
        function changePresence (status) {
            getClientEndpoint().setPresence({
                presence: status
            });
        }

        /**
         * A callback after the respoke client is connected
         */
        function onConnection (connection) {

            var userObj = $.extend({
                onPresenceChange: changePresence
            }, connection, options);

            client = connection;

            App.controllers.userPresenceCtrl(userObj);

            joinGroup();

        }

        /**
         * Initialize the buddy list view
         */
        (function () {
            $el = $(options.renderTo);
            options = $.extend(options, {
                onConnection: onConnection
            });
            App.controllers.authenticationCtrl(options);
        }());

        /**
         * Public API
         */
        return {};

    };

}(jQuery, App));