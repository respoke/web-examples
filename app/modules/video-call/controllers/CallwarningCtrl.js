App.controllers.callWarningCtrl = (function ($, App) {

    'use strict';

    return function (options) {

        var $el;

        // Removes the warning modal from the DOM
        function removeWarning () {
            $el.remove();
        }

        // Renders the template
        function render () {
            $el = $.helpers.insertTemplate({
                template: 'call-warning',
                renderTo: options.el,
                type: 'prepend',
                data: options,

                // Bind events to the template
                bind: {
                    '.popup__wrapper__options__btn': {
                        'click': removeWarning
                    },
                    '.popup__wrapper__options__btn--error': {
                        'click': removeWarning
                    }
                }
            });
        }

        // Initialize the controller
        (function () {
            render();
        }());

        // Expose a public API
        return {
            removeWarning: removeWarning
        };

    };

}(jQuery, App));