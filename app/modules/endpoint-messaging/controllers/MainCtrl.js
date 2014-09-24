App.controllers.messagingCtrl = (function ($, App) {

    'use strict';

    // The Endpoint Messaging View
    return function (options) {

        // This will contain the client who is connected
        var client = null,

            // Once two endpoints are connected, this will contain the connection object
            connection = null,

            // This will hold the root element in memory
            $el = null;

        // A callback fired when the form is submitted to post a new message
        function postMessage (e) {

            // Prevent the form from posting back
            e.preventDefault();

            var $message = $el.find('.em-message__text'),
                message = $message.val();
            sendMessage(message);

            // Reset the value of the message field to by empty
            $message.val('');

        }

        // Appends a message to the thread
        function renderMessage (message) {
            $.helpers.insertTemplate({
                template: 'endpoint-thread-message',
                renderTo: $el.find('.messages'),
                data: {
                    message: message,
                    username: options.username
                }
            });
        }

        // Appends a reply message to the thread
        function renderReply (evt) {
            $.helpers.insertTemplate({
                template: 'endpoint-thread-reply',
                renderTo: $el.find('.messages'),
                data: {
                    username: options.connectTo,
                    message: evt.message.message
                }
            })

            pinToBottom();

        }

        // Sends the user to the bottom of the chat when a new message is posted
        function pinToBottom () {
            var msgHeight = $('.em-thread')[0].scrollHeight;
            $('.em-thread').scrollTop(msgHeight);
        }

        // Renders the main template to hold the thread
        function renderMainTemplate () {

            // Render the template
            $el = $.helpers.insertTemplate({
                template: 'endpoint-thread',
                data: options,
                renderTo: $('#endpoint-messaging')
            });

            // Bind the form submission to our postMessage method
            $el.find('.em-message').bind('submit', postMessage);

        }

        // Sends the message over respoke and appends the message to the thread of the endpoint who posted it
        function sendMessage (message) {
            connection.sendMessage({
                message: message
            });
            renderMessage(message);
        }

        // Creates a connection between the client and the other endpoint
        function createConnection () {
            connection = App.models.endpoint({
                id: options.connectTo,
                client: client,
                onMessage: renderReply
            });
        }

        // When an endpoint is connected, we will set the client data and create a connection between the client and the other endpoint
        function onConnection (_client) {
            client = _client;
            createConnection();
        }

        // Kick off the application
        (function () {
            renderMainTemplate();
            App.models.client(options.username, onConnection);
        }());

        // Public API
        return {};

    };

}(jQuery, App));