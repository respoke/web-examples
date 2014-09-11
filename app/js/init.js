(function ($, App) {

    'use strict';

    App.models.client = new App.models.Client();
    App.models.client.connect('tysoncadenhead');

    App.router = new $.Router();
    App.router.route();

}(jQuery, App));