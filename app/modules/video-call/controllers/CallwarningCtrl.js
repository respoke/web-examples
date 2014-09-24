App.controllers.callWarningCtrl = (function ($, App) {

    return function (options) {

        var $el;

        function removeWarning () {
            $el.remove();
        }

        function rejectCall () {
            removeWarning();
        }

        (function () {
            $el = $.helpers.insertTemplate({
                template: 'call-warning',
                renderTo: options.el,
                type: 'prepend',
                data: options,
                bind: {
                    '.popup__wrapper__options__btn': {
                        'click': removeWarning
                    },
                    '.popup__wrapper__options__btn--error': {
                        'click': rejectCall
                    }
                }
            });
        }());

        return {
            removeWarning: removeWarning
        };

    };

}(jQuery, App));