App.controllers.callWarningCtrl = (function ($, App) {

    return function (options) {

        var api = {

            render: function () {
                var tmpl = $('#call-warning').html(),
                    html = $.tmpl(tmpl, options);
                this.el = $(html);
                options.el.prepend(this.el);
                this.el.find('.popup__wrapper__options__btn').bind('click', this.remove.bind(this));
            },

            remove: function () {
                this.el.remove();
            }

        };

        api.render();

        return api;

    };

}(jQuery, App));