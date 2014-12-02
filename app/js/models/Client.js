(function (respoke, App) {
    'use strict';

    /**
     * Establishes a client connection through the respoke API
     * @param {String} endpointId
     * @param {Function} cb
     * @returns {Promise}
     */
    App.models.client = function (endpointId, name, cb) {

        var client = respoke.createClient({
            appId: '9e1657b2-6880-42b1-9b7e-f79579efc052',
            developmentMode: true,
            baseURL: 'http://localhost:2000'
        });

        if (typeof name === 'function') {
            cb = name;
        }

        client.connect({
            endpointId: endpointId,
            connectionName: name,
            presence: 'available'
        }).done(function () {
            cb(client);
        });

        return client;
    };

}(respoke, App));
