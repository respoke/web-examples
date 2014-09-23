App.controllers.callpromptCtrl = (function ($, App) {

    return function (options) {

        var $el;

        function removePrompt () {
            $el.remove();
        }

        function makeCall () {
            removePrompt();
            options.makeCall();
        }

        (function () {
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

        }());

        return {
            removePrompt: removePrompt
        };

    };

}(jQuery, App));