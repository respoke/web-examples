/*global hex_md5 */

(function ($, App) {

    'use strict';

    var appId = '7c15ec35-71a9-457f-8b73-97caf4eb43ca';

    App.client = respoke.createClient({
        appId: appId,
        developmentMode: true
    });
    
    App.models.Client = new $.Model.extend({

        client: App.client,
        _data: {},

        connect: function (endpointId) {
            this.client.connect({
                endpointId: endpointId
            });
        },

        init: function () {

            var self = this;

            this.messages = new App.collections.Messages();

            this.client.listen('connect', function (evt) {
                self._data = evt.target;
                self._data.gravatar = 'http://gravatar.com/avatar/' + hex_md5(self._data.endpointId);
                $.publish('respoke.connected');
            });

            this.client.listen('message', function (evt) {
                console.log(evt);
            });
        }

    });

}(jQuery, App));