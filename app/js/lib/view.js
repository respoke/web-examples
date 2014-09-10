(function ($) {

    'use strict';

    $.View = function () {};

    $.View.extend = function (options) {

        var View = function (val) {
            this.init(val);
        };

        $.extend(View.prototype, {

            init: function () {}
            
        }, options);

        return View;

    };

}(jQuery));