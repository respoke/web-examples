App.controllers.callPreviewCtrl = (function ($, App) {

    'use strict';

    return function (options) {

        var $el;

        // Render the preview video
        function renderVideo (video) {
            $el.find('#video-preview').append(video);
        }

        // Starts the call
        function startCall () {

            // If the authenticated user didn't initiate this call,
            // remove the preview from the DOM because the call is starting!
            if (!options.initiator) {
                removePreview();

            // If the authenticated user initiated this call, disable the button and change
            // the text in the button to say that we are waiting for an answer
            } else {
                $el.find('.popup__wrapper__options__btn--success')
                    .attr('disabled', 'disabled')
                    .text('Waiting for answer...');
            }

            // Calls the startCall method on the options that were passed in to kick off the call
            if (options.startCall) {
                options.startCall();
            }
        }

        // Cancels the call
        function cancelCall () {
            removePreview();
            if (options.cancelCall) {
                options.cancelCall();
            }
        }

        // Removes the preview modal from the DOM
        function removePreview () {
            $el.remove();
        }

        // Initialize the template
        (function () {
            $el = $.helpers.insertTemplate({

                template: 'call-preview',
                renderTo: options.el,
                type: 'prepend',
                data: options,

                // Events to be bound to the template
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

        // Expose a public API
        return {
            renderVideo: renderVideo,
            removePreview: removePreview
        };

    };

}(jQuery, App));
