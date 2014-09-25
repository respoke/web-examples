(function (App) {
    'use strict';

    /**
     * Presence status types
     * @returns {string[]}
     */
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