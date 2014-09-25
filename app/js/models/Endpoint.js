(function (App) {

    'use strict';

    App.models.endpoint = function (options) {
        return options.client.getEndpoint(options);
    };

}(App));