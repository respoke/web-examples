(function (respoke, App) {

    'use strict';

    App.models.client = function (endpointId, cb) {

        var client = respoke.createClient({
            appId: '7c15ec35-71a9-457f-8b73-97caf4eb43ca',
            developmentMode: true
        });

        client.connect({
            endpointId: endpointId
        }).done(function () {
            cb(client);
        });

        return client;
    };

}(window.respoke, App));