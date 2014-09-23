App.controllers.callPreviewCtrl = (function ($, App) {

    return function (options) {

        var $el;

        function renderVideo (video) {
            $el.find('#video-preview').append(video);
        }

        function startCall () {
            if (!options.initiator) {
                removePreview();
            } else {
                $el.find('.popup__wrapper__options__btn--success').attr('disabled', 'disabled').text('Waiting for answer...');
            }
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
            $el = $.helpers.insertTemplate({
                template: 'call-preview',
                renderTo: options.el,
                type: 'prepend',
                data: options,
                bind: {
                    '.popup__wrapper__options__btn': {
                        'click': cancelCall
                    },
                    '.popup__wrapper__options__btn--success': {
                        'click': startCall
                    }
                }
            });

        }());

        return {
            renderVideo: renderVideo,
            removePreview: removePreview
        };

    };

}(jQuery, App));