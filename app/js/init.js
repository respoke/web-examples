(function ($, App) {

    'use strict';

    App.models.alice = new App.models.Client();
    App.models.alice.connect('Alice');

    App.models.bob = new App.models.Client();
    App.models.bob.connect('Bob');

    $.subscribe('respoke.connected', function () {
        $.router.route();
    });

}(jQuery, App));