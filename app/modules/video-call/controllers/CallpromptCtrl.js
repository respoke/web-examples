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
            var tmpl = $('#prompt-call').html(),
                html = $.tmpl(tmpl, options);
            $el = $(html);
            options.el.prepend($el);
            $el.find('.popup__wrapper__options__btn').bind('click', removePrompt);
            $el.find('.popup__wrapper__options__btn--success').bind('click', makeCall);

        }());

        return {
            removePrompt: removePrompt
        };

    };

}(jQuery, App));