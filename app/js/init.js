(function ($, App) {

    'use strict';

    App.models.client = new App.models.Client();
    App.models.client.connect('tysoncadenhead');

    $.router.route();

}(jQuery, App));