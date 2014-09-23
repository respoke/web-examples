App.controllers.authenticationCtrl = (function ($, App) {

    'use strict';

    /**
     * The Authentication Controller
     */
    return function (options) {

        var $el;

        /**
         * A callback when the name is submitted
         */
        function submitName (e) {

            // Prevent the form from posting back
            e.preventDefault();

            // Get the username from the form
            var username = $el.find('.cbl-name__text').val();

            // Disable the form
            $(e.target).find('input').attr('disabled', 'disabled');

            // Connect the client
            App.models.client(username, options.onConnection);

        }

        /**
         * Renders the authentication form
         */
        function renderForm () {
            $el = $.helpers.insertTemplate({
                template: 'user-authentication',
                renderTo: $el,
                type: 'html'
            });
            $el.find('.cbl-name').bind('submit', submitName);
        }

        /**
         * Initializes the controller
         */
         (function () {
            $el = $(options.renderTo);
            renderForm();
         }());

        /**
         * Public API
         */
        return {};

    };

}(jQuery, App));