(function ($) {

    'use strict';

    $.Model = function () {};

    $.Model.extend = function (options) {

        var Model = function (val) {
            this._data = {};
            this.set(val || {});
            this.init(val);
        };

        $.extend(Model.prototype, {

            init: function () {},

            get: function () {
                return this._data;
            },

            set: function (data) {
                this._data = $.extend(this._data, data);
            }
            
        }, options);

        return Model;

    };

}(jQuery));