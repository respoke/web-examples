(function ($) {

    'use strict';

    $.Model = function () {};

    $.Model.extend = function (options) {

        var Model = function (val) {
            this._data = {};
            this.set(val || {});
        };

        $.extend(Model.prototype, {

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