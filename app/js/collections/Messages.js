(function ($, Respoke) {

    'use strict';
    
    Respoke.collections.Messages = $.Collection.extend({
        model: Respoke.models.Message
    });

}(jQuery, Respoke));