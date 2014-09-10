(function ($, Respoke) {

    'use strict';
    
    Respoke.collections.Endpoints = $.Collection.extend({
        model: Respoke.models.Endpoint
    });

}(jQuery, Respoke));