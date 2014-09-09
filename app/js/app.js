define(['jquery'], function ($) {

    var App = function () {};

    $.extend(App.prototype, {
        collections: [],
        models: [],
        views: []
    });

    return App;

});