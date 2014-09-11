(function ($, App) {

    'use strict';
    
    App.collections.Messages = $.Collection.extend({
        model: App.models.Message,

        send: function (options) {
            var endpoint = App.client.getEndpoint({
                id: options.id
            });
            endpoint.sendMessage({
                message: options.message
            });
        }
    });

}(jQuery, App));