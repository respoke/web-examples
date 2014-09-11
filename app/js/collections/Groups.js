(function ($, App) {

    'use strict';
    
    App.collections.Groups = $.Collection.extend({
        model: App.models.Group
    });

}(jQuery, App));