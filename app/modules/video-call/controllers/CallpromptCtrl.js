App.controllers.callpromptCtrl = (function ($, App) {

    return function (options) {

        var api = {

            render: function () {
                var tmpl = $('#prompt-call').html(),
                    html = $.tmpl(tmpl, options);
                this.el = $(html);
                options.el.prepend(this.el);
                this.el.find('.popup__wrapper__options__btn').bind('click', this.remove.bind(this));
                this.el.find('.popup__wrapper__options__btn--success').bind('click', this.makeCall.bind(this))
            },

            remove: function () {
                this.el.remove();
            },

            makeCall: function () {
                this.el.remove();
                options.makeCall();
            }

        };

        api.render();

        return api;

    };

}(jQuery, App));