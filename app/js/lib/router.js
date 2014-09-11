(function ($, App) {

    'use strict';

    $.Router = function () {

    };

    $.extend($.Router.prototype, {

        routes: {
            '/': 'Home',
            'endpoint-messaging': 'EndpointMessaging'
        },

        set: function (route) {
            document.location.hash = route;
        },

        route: function () {
            var route = document.location.hash.replace('#', '');
            if (!route || this.routes[route]) {
                route = route || '/';
            }
            return new App.views[this.routes[route]]();
        }

    });

}(jQuery, App));