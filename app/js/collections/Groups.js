(function ($, Respoke) {

    'use strict';
    
    Respoke.collections.Groups = $.Collection.extend({
        model: Respoke.models.Group
    });

}(jQuery, Respoke));