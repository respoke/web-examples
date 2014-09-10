(function ($) {

    'use strict';

    $.Collection = function () {};

    $.Collection.extend = function (options) {

        var Collection = function (val) {
            this._data = [];
            this.set(val || []);
        };

        $.extend(Collection.prototype, {

            length: function () {
                return this._data.length;
            },
            
            find: function (i) {
                if (i) {
                    return this._data[i];
                } else {
                    return this._data;
                }
            },
            
            add: function (val) {
                this._data.push(new this.model(val));
            },
            
            remove: function (i) {
                this._data.splice(i, 1);
            },
            
            set: function (data) {
                for (var i = 0; i < data.length; i++) {
                    this.add(data[i]);
                }
            },
            
            toJSON: function () {
                var data = [];
                for (var i = 0; i < this._data.length; i++) {
                    data.push(this._data[i].get());
                }
                return data;
            }
            
        }, options);

        return Collection;

    };

}(jQuery));