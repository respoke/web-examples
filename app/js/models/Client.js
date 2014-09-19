(function (App) {

    'use strict';

    App.models.client = function (endpointId, fn) {

        var client = respoke.createClient({
            appId: '7c15ec35-71a9-457f-8b73-97caf4eb43ca',
            developmentMode: true
        });

        client.connect({
            endpointId: endpointId
        }).done(function () {
            fn(client);
        });

        return client;

    };

}(App));