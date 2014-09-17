(function (App) {

    'use strict';

    App.models.statusTypes = function () {
        return [
            'available',
            'unavailable',
            'away',
            'busy',
            'be right back',
            'do not disturb'
        ];
    };

}(App));