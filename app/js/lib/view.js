(function ($) {

    'use strict';

    $.View = function () {};

    $.View.extend = function (options) {

        var cache = {};

        var getTemplate = function (fn) {
            if (cache[this.template]) {
                fn(cache[this.template]);
            } else {
                $.ajax({
                    method: 'GET',
                    url: '/templates/' + this.template + '.html'
                }).done(fn);
            }
        };

        var initView = function (fn, val) {
            for (var i in this.events) {
                var selector = i.split(' '),
                    evt = selector[0];
                selector.shift();
                selector = selector.join(' ');
                this.el.delegate(selector, evt, this.events[i].bind(this));
            }
            this.render(val);
        };

        var View = function (val) {
            var self = this;
            val = val || {};

            this.init(val);

            $.extend(this, val, {
                el: $(options.el || val.el),
                events: $.extend({}, this.events, val.events || {})
            });

            if (this.template) {
                getTemplate.call(this, function (html) {
                    var tmpl = $.tmpl(html, self);
                    self.el.html('<div>' + tmpl + '</div>');
                    initView.call(self, val);
                });
            } else {
                initView.call(self, val);
            }

        };

        $.extend(View.prototype, {

            events: {},

            init: function () {},
            render: function () {}
            
        }, options);

        return View;

    };

}(jQuery));