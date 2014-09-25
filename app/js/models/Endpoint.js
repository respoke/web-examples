(function (App) {
    'use strict';

    /**
     * Gets an endpoint from a respoke.Client object embedded
     * in the options object
     * @param {{client: respoke.Client}} options
     * @returns {respoke.Endpoint}
     */
    App.models.endpoint = function (options) {
        return options.client.getEndpoint(options);
    };

}(App));