var messagingView = (function ($, App) {

    'use strict';

    return function (options) {

        var client, connection, $el;

        options.renderTo = options.renderTo || '#endpoint-messaging';

        return {

            sendMessage: function (message) {
                connection.sendMessage({
                    message: message
                });
                this.renderMessage(message);
            },

            postMessage: function (e) {
                e.preventDefault();

                var $message = $el.find('.em-message__text'),
                    message = $message.val();
                this.sendMessage(message);

                $message.val('');
            },

            getTemplate: function (options) {
                var tmpl = $(options.el).html(),
                    html = $.tmpl(tmpl, options.data);
                return html;
            },

            renderMessage: function (message) {
                var html = this.getTemplate({
                    el: '#endpoint-thread-message',
                    data: {
                        message: message
                    }
                });
                $el.find('.em-thread').append(html);
            },

            renderReply: function (evt) {
                var html = this.getTemplate({
                    el: '#endpoint-thread-reply',
                    data: {
                        username: options.connectTo,
                        message: evt.message.message
                    }
                });
                $el.find('.em-thread').append(html);
            },

            renderMainTemplate: function () {
                var html = this.getTemplate({
                    el: '#endpoint-thread',
                    data: options
                });
                $el = $(html);
                $el.find('.em-message').bind('submit', this.postMessage.bind(this));
                $(options.renderTo).append($el);
            },

            createConnection: function () {
                connection = App.models.endpoint({
                    id: options.connectTo,
                    client: client,
                    onMessage: this.renderReply.bind(this)
                });
            },

            onConnection: function (obj) {
                client = obj;
                this.createConnection();
            },

            init: function () {
                this.renderMainTemplate();
                App.models.client(options.username, this.onConnection.bind(this));
                return this;
            }

        };

    };

}(jQuery, App));