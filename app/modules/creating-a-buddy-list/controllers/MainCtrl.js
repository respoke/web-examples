App.controllers.buddylistCtrl = (function ($, App) {

    'use strict';

    /**
     * The Main Buddy List Controller
     */
    return function (options) {
        var userClient, $el, endpoints = {}, buddies = {};

        /**
         * Returns the client's endpoint
         */
//        function getClientEndpoint () {
//            return endpoints[client.endpointId];
//        }

        /**
         * Renders a single group member when the member
         * joins the "Everyone" group
         * @param {respoke.Connection} connection
         */
        function renderGroupMember (connection) {
            // Save a reference to the endpoint
//            var endpoint = endpoints[connection.endpointId] = connection.getEndpoint();
            var endpoint = connection.getEndpoint();
            buddies[endpoint.id] = App.controllers.buddyCtrl(options, endpoint);
        }

        // Renders all of the current group members
        function renderGroup (members) {
            $.each(members, function(index, connection) {
                if (connection.endpointId === userClient.endpointId) {
                    return;
                }
                renderGroupMember(connection);
            });
        }

        /**
         * When a group member joins, we need to add them to the group list
         * @param {Object} e - event
         */
        function onMemberJoin (e) {
            renderGroupMember(e.connection);
        }

        /**
         * When a group member leaves, we can remove them from the DOM
         * @param {Object} e - event
         */
        function onMemberLeave (e) {
            var endpointId = e.connection.endpointId;
            //var buddy = buddies[endpointId];
            var cls = $.helpers.getClassName(endpointId);
            $el.find('.buddy-list #user-' + cls).remove();
        }

        /**
         * Gets the members of a group and listens for additions and subtractions
         */
        function onJoinGroupSuccess (group) {
            group.listen('join', onMemberJoin);
            group.listen('leave', onMemberLeave);
            group.getMembers({
                onSuccess: renderGroup
            });
        }

        // Join a group
        function joinGroup () {
            userClient.join({
                id: 'everyone',
                onSuccess: onJoinGroupSuccess
            });
        }

        // Changes the status of the connected endpoint
        function changePresence (status) {
//            getClientEndpoint().setPresence({
//                presence: status
//            });
            userClient.setPresence({
                presence: status
            });
        }

        /**
         * A callback after the respoke client is connected
         * @param {respoke.Client} client
         */
        function onConnection (client) {
            var userObj = $.extend({
                onPresenceChange: changePresence
            }, client, options);

            userClient = client;

            /*
             * Set up the user presence form. When presence changes,
             * it will invoke the onPresenceChange callback in the
             * options object.
             */
            App.controllers.userPresenceCtrl(userObj);

            joinGroup();
        }

        // Initialize the buddy list view
        $el = $(options.renderTo);
        options = $.extend(options, {
            onConnection: onConnection
        });

        /*
         * Set up the authentication form. On submit it will
         * establish the connection and invoked the onConnection
         * callback in the options object.
         */
        App.controllers.authenticationCtrl(options);

        // Public API
        return {};
    };

}(jQuery, App));