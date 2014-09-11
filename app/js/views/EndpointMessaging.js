(function ($, App) {

    'use strict';

    App.views.EndpointMessaging = $.View.extend({
        el: 'body',
        template: 'endpoint-messaging',

        init: function () {
            console.log(App.models.alice);
            console.log(App.models.bob);
        }

    });

}(jQuery, App));