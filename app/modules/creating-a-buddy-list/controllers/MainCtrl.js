App.controllers.buddylistCtrl = (function ($, App) {
    'use strict';

    /**
     * The Main Buddy List Controller
     */
    return function (options) {

        /**
         * Client for the logged-in user
         * @type {respoke.Client}
         */
        var userClient,
            /**
             * "Everyone" group
             * @type {respoke.Group}
             */
            everyoneGroup,
            /**
             * Root HTML element
             * @type {jQuery}
             */
            $el,
            /**
             * Buddies list
             * @type {Object} - hash of buddy controllers {endpointId -> buddyCtrl}
             */
            buddies = {};

        /**
         * Renders a single group member when the member
         * joins the "Everyone" group
         * @param {respoke.Endpoint} endpoint
         */
        function renderGroupMember (endpoint) {
            var endpointId = endpoint.id,
                buddy = buddies[endpointId];

            // if there is a previous, undisposed buddy with an
            // active endpoint; dispose it first, then replace
            // it
            if (buddy) {
                buddy.dispose();
            }

            buddies[endpointId] = App.controllers.buddyCtrl(options, endpoint);
        }

        /**
         * Renders all of the current group members
         * @param {Array<respoke.Connection>} connections
         */
        function renderGroup (connections) {
            $.each(connections, function(index, connection) {
                // ignore "self" in buddies list
                if (connection.endpointId === userClient.endpointId) {
                    return;
                }
                renderGroupMember(connection.getEndpoint());
            });
        }

        /**
         * When a group member joins, we need to add them to the group list
         * @param {{connection: respoke.Connection}} e - event
         */
        function onMemberJoin (e) {
            renderGroupMember(e.connection.getEndpoint());
        }

        /**
         * When a group member leaves, we can remove them from the DOM
         * @param {{connection: respoke.Connection}} e - event
         */
        function onMemberLeave (e) {
            var endpointId = e.connection.endpointId;
            var buddy = buddies[endpointId];
            if (buddy) {
                buddy.dispose();
                buddies[endpointId] = null;
            }
            var userClassName = $.helpers.getClassName(endpointId);
            $el.find('.buddy-list #user-' + userClassName).remove();
        }

        /**
         * Joins the client to the "Everyone" group
         */
        function joinGroup () {
            userClient.join({
                id: 'everyone'
            }).then(function (group) {
                everyoneGroup = group;
                everyoneGroup.listen('join', onMemberJoin);
                group.getMembers().then(renderGroup);
            });
        }

        /**
         * Changes the status of the connected endpoint
         * @param {String} status
         */
        function changePresence (status) {
            userClient.setPresence({
                presence: status
            });
        }

        /**
         * A callback after the respoke client is connected
         * @param {respoke.Client} client
         */
        function onConnection (client) {
            userClient = client;

            var presenceOptions = $.extend({}, options, {
                onPresenceChange: changePresence
            });

            /*
             * Set up the user presence form. When presence changes,
             * it will invoke the onPresenceChange callback in the
             * options object.
             */
            App.controllers.userPresenceCtrl(client, presenceOptions);

            joinGroup();
        }

        // initialize the buddy list view
        $el = $(options.renderTo);
        var authOptions = $.extend({}, options, {
            onConnection: onConnection
        });

        /*
         * Set up the authentication form. On submit it will
         * establish the connection and invoked the onConnection
         * callback in the options object.
         */
        App.controllers.authenticationCtrl(authOptions);
    };

}(jQuery, App));