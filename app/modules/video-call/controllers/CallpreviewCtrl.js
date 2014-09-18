App.controllers.callPreviewCtrl = (function ($, App) {

    return function (options) {

        var api = {

            renderVideo: function (video) {
                this.el.find('#video-preview').append(video);
            },

            render: function () {
                var tmpl = $('#call-preview').html(),
                    html = $.tmpl(tmpl, options);
                this.el = $(html);
                options.el.prepend(this.el);
                this.el.find('.popup__wrapper__options__btn').bind('click', this.remove.bind(this));
                this.el.find('.popup__wrapper__options__btn--success').bind('click', this.startCall.bind(this));
            },

            startCall: function () {
                options.startCall();
            },

            remove: function () {
                this.el.remove();
            }

        };

        api.render();

        return api;

    };

}(jQuery, App));