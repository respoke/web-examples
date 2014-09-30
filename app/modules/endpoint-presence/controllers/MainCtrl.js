App.controllers.endpointCtrl = (function ($, App) {

    'use strict';

    // The Main Endpoint Presence Controller
    return function (options) {

        // This will contain the client object once the client is connected
        var client = null,

            // Keep a copy of the root element in memory
            $el = $(options.renderTo),

            // Just a bunch of fake users
            users = {
                janet: {
                    username: 'Janet-' + Date.now(),
                    presence: 'dnd'
                },
                jennifer: {
                    username: 'Jennifer-' + Date.now(),
                    presence: 'busy'
                }
            };

        // Appends a buddy to the members list in the DOM
        function renderBuddy (connection) {
            $.helpers.insertTemplate({
                template: 'user-buddy',
                renderTo: $el.find('.buddy-list'),
                data: connection
            });
        }

        // Renders the main template
        function render () {
            $.helpers.insertTemplate({
                template: 'user-display',
                renderTo: $el,
                data: $.extend({
                    statusTypes: App.models.statusTypes()        
                }, options, client)
            });

            $el.find('.user-status-dropdown__status__select').bind('change', updatePresence);
        }

        // Loops over all of the static buddies and renders them
        function renderBuddies () {
            for (var user in users) {
                if (users.hasOwnProperty(user)) {
                    renderBuddy(users[user]);
                }
            }
        }

        // Updates the presence of the user
        function updatePresence (e) {
            var presence = $(e.target).val();
            $el.find('.user-status-dropdown > div')
                .attr('class', 'user-status-dropdown__status--' + $.helpers.getPresenceClass(presence))
                .html(presence);
            client.setPresence({
                presence: presence
            });
        }

        // Replaces the status of a buddy in the DOM
        function updateBuddyPresence (data) {
            $.helpers.insertTemplate({
                template: 'user-buddy',
                renderTo: $el.find('#user-' + data.target.id),
                type: 'replaceWith',
                data: {
                    username: data.target.id,
                    presence: data.target.presence
                }
            });
        }

        // Creates a connection between the client and the other endpoint
        function createConnection () {

            // Connect to the other real user
            var connection = App.models.endpoint({
                id: options.connectTo,
                client: client,
                onPresence: updateBuddyPresence
            });

            // Render the other user to the buddy list
            renderBuddy({
                username: connection.id,
                presence: connection.presence
            });
            
        }

        // When an endpoint is connected, we will set the client data and create a connection between the client and the other endpoint
        function onConnection (e) {
            client = e;
            render();
            createConnection();
            renderBuddies();
        }

        // Kick off the application
        (function () {
            App.models.client(options.username, onConnection);
        }());

        // Public API
        return {};

    };

}(jQuery, App));