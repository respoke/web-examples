App.controllers.messagingCtrl = (function ($, App) {

    'use strict';

    /**
     * The Endpoint Messaging View
     */
    return function (options) {

        var client, connection, $el;

        return {

            /**
             * A callback fired when the form is submitted to post a new message
             */
            postMessage: function (e) {

                // Prevent the form from posting back
                e.preventDefault();

                var $message = $el.find('.em-message__text'),
                    message = $message.val();
                this.sendMessage(message);

                // Reset the value of the message field to by empty
                $message.val('');
            },

            /**
             * Appends a message to the thread
             */
            renderMessage: function (message) {

                // Get the contents of the inline template
                var tmpl = $('#endpoint-thread-message').html(),

                    // Applies the data to the template using John Resig's micro-templating
                    html = $.tmpl(tmpl, {
                        message: message
                    });

                $el.find('.em-thread').append(html);
            },

            /**
             * Appends a reply message to the thread
             */
            renderReply: function (evt) {

                // Get the contents of the inline template
                var tmpl = $('#endpoint-thread-reply').html(),

                    // Applies the data to the template using John Resig's micro-templating
                    html = $.tmpl(tmpl, {
                        username: options.connectTo,
                        message: evt.message.message
                    });

                $el.find('.em-thread').append(html);
            },

            /**
             * Renders the main template to hold the thread
             */
            renderMainTemplate: function () {

                // Get the contents of the inline template
                var tmpl = $('#endpoint-thread').html(),

                    // Applies the data to the template using John Resig's micro-templating
                    html = $.tmpl(tmpl, options);

                // The element is defined outside of this scope so we can access it in any method of this view
                $el = $(html);

                // Bind the form submission to our postMessage method
                $el.find('.em-message').bind('submit', this.postMessage.bind(this));

                $('#endpoint-messaging').append($el);
            },

            /**
             * Sends the message over respoke and appends the message to the thread of the endpoint who posted it
             */
            sendMessage: function (message) {
                connection.sendMessage({
                    message: message
                });
                this.renderMessage(message);
            },

            /**
             * Creates a connection between the client and the other endpoint
             */
            createConnection: function () {
                connection = App.models.endpoint({
                    id: options.connectTo,
                    client: client,
                    onMessage: this.renderReply
                });
            },

            /**
             * When an endpoint is connected, we will set the client data and create a connection between the client and the other endpoint
             */
            onConnection: function (_client) {
                client = _client;
                this.createConnection();
            },

            /**
             * Kicks off the view by attempting to initialize the client and rendering the main template for that client 
             */
            init: function () {
                this.renderMainTemplate();
                App.models.client(options.username, this.onConnection.bind(this));
            }

        };

    };

}(jQuery, App));