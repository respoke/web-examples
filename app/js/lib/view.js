(function ($) {

    'use strict';

    $.View = function () {};

    $.View.extend = function (options) {

        var View = function (val) {
            val = val || {};
            this.el = $(options.el || val.el);
            this.events = $.extend({}, this.events, val.events || {});

            this.events.forEach(function (evt, i) {
                console.log(evt, i);
            });

            this.init(val);
        };

        $.extend(View.prototype, {

            events: {},

            init: function () {}
            
        }, options);

        return View;

    };

}(jQuery));