App.controllers.callWarningCtrl = (function ($, App) {

    return function (options) {

        var $el;

        function removeWarning () {
            $el.remove();
        }

        (function () {
            var tmpl = $('#call-warning').html(),
                html = $.tmpl(tmpl, options);
            $el = $(html);
            options.el.prepend($el);
            $el.find('.popup__wrapper__options__btn').bind('click', removeWarning);
        }());

        return {
            removeWarning: removeWarning
        };

    };

}(jQuery, App));