(function ($, App) {

    'use strict';
    
    App.collections.Endpoints = $.Collection.extend({
        model: App.models.Endpoint
    });

}(jQuery, App));