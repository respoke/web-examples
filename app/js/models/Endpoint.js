(function (App) {

    'use strict';

    App.models.endpoint = function (options, fn) {
        return options.client.getEndpoint(options);
    };

}(App));