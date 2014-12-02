App.controllers.callpromptCtrl = (function ($, App) {

    'use strict';

    return function (options) {

        var $el;

        // Remove the call prompt from the DOM
        function removePrompt () {
            $el.remove();
        }

        // Kicks off the call
        function makeCall () {
            removePrompt();
            options.makeCall();
        }

        // Renders the template
        function render () {
            $el = $.helpers.insertTemplate({
                template: 'prompt-call',
                renderTo: options.el,
                type: 'prepend',
                data: options,
                bind: {
                    '.popup__wrapper__options__btn': {
                        'click': removePrompt
                    },
                    '.popup__wrapper__options__btn--success': {
                        'click': makeCall
                    }
                }
            });
        }

        // Initialize this controller
        (function () {
            render();
        }());

        // Expose a public API
        return {
            removePrompt: removePrompt
        };

    };

}(jQuery, App));
