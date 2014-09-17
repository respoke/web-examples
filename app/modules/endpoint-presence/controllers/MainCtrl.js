App.controllers.endpointCtrl = (function ($, App) {

    'use strict';

    /**
     * The Main Endpoint Presence Controller
     */
    return function (options) {

        return {

            /**
             * Some mocked up static users
             */
            users: {
                janet: {
                    username: 'Janet',
                    presence: 'dnd'
                },
                jennifer: {
                    username: 'Jennifer',
                    presence: 'busy'
                }
            },

            /**
             * Renders the buddy template and returns the markup
             */
            getBuddyTemplate: function (connection) {
                var tmpl = $('#user-buddy').html();
                return $.tmpl(tmpl, connection);
            },

            /**
             * Appends a buddy to the members list in the DOM
             */
            renderBuddy: function (connection) {
                var html = this.getBuddyTemplate(connection);
                this.el.find('.buddy-list').append(html);
            },

            /**
             * Renders the main template
             */
            render: function () {
                var tmpl = $('#user-display').html(),
                    html = $.tmpl(tmpl, $.extend({
                        statusTypes: App.models.statusTypes()        
                    }, options, this.client));
                this.el.html(html);
                this.el.find('.user-status-dropdown__status__select').bind('change', this.updatePresence.bind(this));
            },

            /**
             * Loops over all of the static buddies and renders them
             */
            renderBuddies: function () {
                for (var user in this.users) {
                    if (this.users.hasOwnProperty(user)) {
                        this.renderBuddy(this.users[user]);
                    }
                }
            },

            /**
             * Updates the presence of the user
             */
            updatePresence: function (e) {
                var presence = $(e.target).val();
                this.el.find('.user-status-dropdown > div')
                    .attr('class', 'user-status-dropdown__status--' + $.helpers.getPresenceClass(presence))
                    .html(presence);
                this.client.setPresence({
                    presence: presence
                });
            },

            /**
             * Replaces the status of a buddy in the DOM
             */
            updateBuddyPresence: function (data) {
                var html = this.getBuddyTemplate({
                    username: data.target.id,
                    presence: data.target.presence
                });
                this.el.find('#user-' + data.target.id).replaceWith(html);
            },

            /**
             * Creates a connection between the client and the other endpoint
             */
            createConnection: function () {

                // Connect to the other real user
                var connection = App.models.endpoint({
                    id: options.connectTo,
                    client: this.client,
                    onPresence: this.updateBuddyPresence.bind(this)
                });

                // Render the other user to the buddy list
                this.renderBuddy({
                    username: connection.id,
                    presence: connection.presence
                });
                
            },

            /**
             * When an endpoint is connected, we will set the client data and create a connection between the client and the other endpoint
             */
            onConnection: function (client) {
                this.client = client;
                this.render();
                this.createConnection();
                this.renderBuddies();
            },

            /**
             * Kicks off the controller
             */
            init: function () {
                this.el = $(options.renderTo);
                App.models.client(options.username, this.onConnection.bind(this));
            }

        };

    }

}(jQuery, App));