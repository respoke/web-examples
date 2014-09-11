(function ($) {

    'use strict';

    $.View = function () {};

    $.View.extend = function (options) {

        var initView = function (fn) {
            /*this.events.forEach(function (evt, i) {
                console.log(evt, i);
            });*/
            fn();
        };

        var View = function (val) {
            var self = this;
            val = val || {};

            $.extend(this, {
                template: val.template || options.template,
                el: $(options.el || val.el),
                events: $.extend({}, this.events, val.events || {})
            });

            if (this.template) {
                $.ajax({
                    method: 'GET',
                    url: '/templates/' + this.template + '.html'
                }).done(function (html) {
                    self.el.html(
                        $.tmpl(html, self)
                    );
                    initView.call(self, function () {
                        self.init(val);
                    });
                });
            } else {
                this.init(val);
            }

        };

        $.extend(View.prototype, {

            events: {},

            init: function () {}
            
        }, options);

        return View;

    };

}(jQuery));