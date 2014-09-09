require.config({

    paths: {
        'jquery': '_lib/jquery',
        'jquery-core': '/vendor/jquery/dist/jquery',
        'backbone': '/vendor/backbone/backbone',
        'underscore': '/vendor/underscore/underscore'
    },

    shim: {
        'jquery-core': {
            exports: '$'
        }
    }

});

require([
    'jquery',
    'app'
], function ($, App) {
    $.respoke = new App();
    window.$ = $;
});