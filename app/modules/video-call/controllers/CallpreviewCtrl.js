App.controllers.callPreviewCtrl = (function ($, App) {

    return function (options) {

        var $el;

        function renderVideo (video) {
            $el.find('#video-preview').append(video);
        }

        function startCall () {
            removePreview();
            options.startCall();
        }

        function cancelCall () {
            removePreview();
            options.cancelCall();
        }

        function removePreview () {
            $el.remove();
        }

        (function () {

             var tmpl = $('#call-preview').html(),
                    html = $.tmpl(tmpl, options);
                $el = $(html);
                options.el.prepend($el);
                $el.find('.popup__wrapper__options__btn').bind('click', cancelCall);
                $el.find('.popup__wrapper__options__btn--success').bind('click', startCall);

        }());

        return {
            renderVideo: renderVideo
        };

    };

}(jQuery, App));