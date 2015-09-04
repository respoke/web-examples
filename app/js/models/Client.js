(function (respoke, App) {
    'use strict';

    /**
     * Establishes a client connection through the respoke API
     * @param {String} endpointId
     * @param {Function} cb
     * @returns {Promise}
     */
    App.models.client = function (endpointId, cb) {

        var client = respoke.createClient({
            appId: '540f4c90-da4d-468f-845f-4133ce7e6dc4',
            developmentMode: true
        });

        client.connect({
            endpointId: endpointId,
            presence: 'available'
        }).done(function () {
            cb(client);
        });

        return client;
    };

}(respoke, App));