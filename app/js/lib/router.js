(function ($, App) {

    'use strict';

    $.router = {

        routes: {
            '/': 'Home',
            '/endpoint-messaging': 'EndpointMessaging',
            '/endpoint-presence': 'EndpointPresence'
        },

        route: function (route) {

            if (route) {
                document.location.hash = route;
            } else {
                route = document.location.hash.replace('#', '');
            }
            
            if (!route || !this.routes[route]) {
                route = document.location.hash = '/';
            }

            return new App.views[this.routes[route]]();
        }

    };

    $(window).bind('hashchange', function () {
        $.router.route();
    });

}(jQuery, App));